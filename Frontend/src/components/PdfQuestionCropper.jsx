import { useState, useRef, useEffect, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { uploadCroppedQuestion } from '../services/questionService'
import { getYears, createYear } from '../services/yearsService'
import { detectQuestionBoxes } from '../services/aiService'

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`

function PdfQuestionCropper({ currentUser, onQuestionAdded }) {
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [pageNum, setPageNum] = useState(1)
  const [numPages, setNumPages] = useState(0)

  // Dynamic years
  const [availableYears, setAvailableYears] = useState([])
  const [showAddYearModal, setShowAddYearModal] = useState(false)
  const [newYearInput, setNewYearInput] = useState('')

  // Metadata Form
  const [courseName, setCourseName] = useState('Arapça-2')
  const [examType, setExamType] = useState('Yaz Okulu')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [correctOption, setCorrectOption] = useState('A')
  const [explanation, setExplanation] = useState('')

  // Crop Box coordinates (canvas relative)
  const [cropRect, setCropRect] = useState(null) // { x, y, width, height }
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Status & Message
  const [statusMsg, setStatusMsg] = useState('')
  const [saving, setSaving] = useState(false)

  // AI Detection
  const [aiDetecting, setAiDetecting] = useState(false)
  const [detectedBoxes, setDetectedBoxes] = useState([])

  const canvasRef = useRef(null)
  const overlayCanvasRef = useRef(null)

  // Load Years
  const loadYearsList = useCallback(async () => {
    try {
      const yrs = await getYears()
      setAvailableYears(yrs)
      if (yrs.length > 0 && !yrs.includes(selectedYear)) {
        setSelectedYear(yrs[yrs.length - 1])
      }
    } catch (err) {
      console.error('Yıllar okunamadı:', err)
    }
  }, [selectedYear])

  useEffect(() => {
    loadYearsList()
  }, [loadYearsList])

  // File Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file || file.type !== 'application/pdf') {
      alert('Lütfen geçerli bir PDF dosyası seçin.')
      return
    }

    setPdfFile(file)
    setCropRect(null)
    setStatusMsg('')
    setDetectedBoxes([])

    try {
      const fileArrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: fileArrayBuffer })
      const doc = await loadingTask.promise
      setPdfDoc(doc)
      setNumPages(doc.numPages)
      setPageNum(1)
    } catch (err) {
      console.error('PDF yükleme hatası:', err)
      alert('PDF dosyası okunamadı: ' + err.message)
    }
  }

  // Render Page onto Canvas
  const renderPage = useCallback(async (num) => {
    if (!pdfDoc) return
    try {
      const page = await pdfDoc.getPage(num)
      const viewport = page.getViewport({ scale: 1.5 })

      const canvas = canvasRef.current
      const overlay = overlayCanvasRef.current
      if (!canvas || !overlay) return

      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width

      overlay.height = viewport.height
      overlay.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }
      await page.render(renderContext).promise
    } catch (err) {
      console.error('Sayfa render hatası:', err)
    }
  }, [pdfDoc])

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum)
      setDetectedBoxes([]) // Sayfa değiştiğinde eski kutuları temizle
    }
  }, [pdfDoc, pageNum, renderPage])

  // AI Detection Handler
  const handleAiDetect = async () => {
    if (!canvasRef.current) return
    
    setAiDetecting(true)
    setStatusMsg('')
    setDetectedBoxes([])

    try {
      const base64Image = canvasRef.current.toDataURL('image/png')
      const items = await detectQuestionBoxes(base64Image)
      
      if (!items || items.length === 0) {
        setStatusMsg('Soru bloğu tespit edilemedi.')
        return
      }

      const canvas = canvasRef.current
      const padding = 6

      const converted = items.map((item, idx) => {
        const [ymin, xmin, ymax, xmax] = item.box || item.Box || [0, 0, 0, 0]
        
        let x = (xmin / 1000) * canvas.width - padding
        let y = (ymin / 1000) * canvas.height - padding
        let width = ((xmax - xmin) / 1000) * canvas.width + (padding * 2)
        let height = ((ymax - ymin) / 1000) * canvas.height + (padding * 2)
        
        x = Math.max(0, x)
        y = Math.max(0, y)
        width = Math.min(canvas.width - x, width)
        height = Math.min(canvas.height - y, height)

        return {
          id: idx,
          questionNumber: item.questionNumber || item.QuestionNumber || `${idx + 1}`,
          box: { x, y, width, height }
        }
      })

      setDetectedBoxes(converted)
      setStatusMsg(`AI: ${converted.length} soru alanı başarıyla tespit edildi!`)
    } catch (err) {
      console.error('AI Tespiti hatası:', err)
      setStatusMsg('AI tespiti başarısız oldu: ' + err.message)
    } finally {
      setAiDetecting(false)
    }
  }

  // Draw Selection Overlay with 8 Handles (Corners + Sides)
  useEffect(() => {
    const overlay = overlayCanvasRef.current
    if (!overlay) return
    const ctx = overlay.getContext('2d')
    ctx.clearRect(0, 0, overlay.width, overlay.height)

    if (cropRect && cropRect.width > 0 && cropRect.height > 0) {
      const rect = overlay.getBoundingClientRect()
      const scale = overlay.width / (rect.width || 1)

      // Darken background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.fillRect(0, 0, overlay.width, overlay.height)

      // Clear cropped rectangle
      ctx.clearRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height)

      // Draw outer border
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3 * scale
      ctx.strokeRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height)

      // Draw grid lines inside (rule of thirds / guide)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1 * scale
      ctx.beginPath()
      ctx.moveTo(cropRect.x + cropRect.width / 3, cropRect.y)
      ctx.lineTo(cropRect.x + cropRect.width / 3, cropRect.y + cropRect.height)
      ctx.moveTo(cropRect.x + (cropRect.width * 2) / 3, cropRect.y)
      ctx.lineTo(cropRect.x + (cropRect.width * 2) / 3, cropRect.y + cropRect.height)
      ctx.moveTo(cropRect.x, cropRect.y + cropRect.height / 3)
      ctx.lineTo(cropRect.x + cropRect.width, cropRect.y + cropRect.height / 3)
      ctx.moveTo(cropRect.x, cropRect.y + (cropRect.height * 2) / 3)
      ctx.lineTo(cropRect.x + cropRect.width, cropRect.y + (cropRect.height * 2) / 3)
      ctx.stroke()

      // 8 Handles (4 corners + 4 midpoints)
      const handleRadius = 8 * scale
      const points = [
        { x: cropRect.x, y: cropRect.y },
        { x: cropRect.x + cropRect.width / 2, y: cropRect.y },
        { x: cropRect.x + cropRect.width, y: cropRect.y },
        { x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height / 2 },
        { x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height },
        { x: cropRect.x + cropRect.width / 2, y: cropRect.y + cropRect.height },
        { x: cropRect.x, y: cropRect.y + cropRect.height },
        { x: cropRect.x, y: cropRect.y + cropRect.height / 2 },
      ]

      points.forEach(p => {
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2.5 * scale
        ctx.beginPath()
        ctx.arc(p.x, p.y, handleRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      })
    }
  }, [cropRect])

  // Mouse / Touch Events for Selection & Resize/Move
  const [activeHandle, setActiveHandle] = useState(null)
  const [initialCropRect, setInitialCropRect] = useState(null)

  const getCanvasCoords = (e) => {
    const overlay = overlayCanvasRef.current
    if (!overlay) return { x: 0, y: 0, scaleX: 1, scaleY: 1 }
    const rect = overlay.getBoundingClientRect()
    const scaleX = overlay.width / (rect.width || 1)
    const scaleY = overlay.height / (rect.height || 1)

    let clientX = e.clientX || 0
    let clientY = e.clientY || 0

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX
      clientY = e.changedTouches[0].clientY
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
      scaleX,
      scaleY,
    }
  }

  // Window mouseup listener to catch release outside canvas
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        setActiveHandle(null)
      }
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchend', handleGlobalMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
    }
  }, [isDragging])

  const handleMouseDown = (e) => {
    const coords = getCanvasCoords(e)
    setIsDragging(true)
    setDragStart(coords)

    if (cropRect && cropRect.width > 10 && cropRect.height > 10) {
      // 24px screen hit target radius converted to canvas coordinates
      const hitX = 24 * coords.scaleX
      const hitY = 24 * coords.scaleY
      const { x, y, width, height } = cropRect

      // 1. Check Corners
      const isTL = Math.abs(coords.x - x) <= hitX && Math.abs(coords.y - y) <= hitY
      const isTR = Math.abs(coords.x - (x + width)) <= hitX && Math.abs(coords.y - y) <= hitY
      const isBL = Math.abs(coords.x - x) <= hitX && Math.abs(coords.y - (y + height)) <= hitY
      const isBR = Math.abs(coords.x - (x + width)) <= hitX && Math.abs(coords.y - (y + height)) <= hitY

      if (isTL) { setActiveHandle('tl'); setInitialCropRect({ ...cropRect }); return; }
      if (isTR) { setActiveHandle('tr'); setInitialCropRect({ ...cropRect }); return; }
      if (isBL) { setActiveHandle('bl'); setInitialCropRect({ ...cropRect }); return; }
      if (isBR) { setActiveHandle('br'); setInitialCropRect({ ...cropRect }); return; }

      // 2. Check Sides
      const isTop = Math.abs(coords.y - y) <= hitY && coords.x >= x - hitX && coords.x <= x + width + hitX
      const isBottom = Math.abs(coords.y - (y + height)) <= hitY && coords.x >= x - hitX && coords.x <= x + width + hitX
      const isLeft = Math.abs(coords.x - x) <= hitX && coords.y >= y - hitY && coords.y <= y + height + hitY
      const isRight = Math.abs(coords.x - (x + width)) <= hitX && coords.y >= y - hitY && coords.y <= y + height + hitY

      if (isTop) { setActiveHandle('top'); setInitialCropRect({ ...cropRect }); return; }
      if (isBottom) { setActiveHandle('bottom'); setInitialCropRect({ ...cropRect }); return; }
      if (isLeft) { setActiveHandle('left'); setInitialCropRect({ ...cropRect }); return; }
      if (isRight) { setActiveHandle('right'); setInitialCropRect({ ...cropRect }); return; }

      // 3. Check Inside Box (Move)
      if (coords.x >= x && coords.x <= x + width && coords.y >= y && coords.y <= y + height) {
        setActiveHandle('move')
        setInitialCropRect({ ...cropRect })
        return
      }
    }

    // 4. Draw New Box
    setActiveHandle('new')
    setCropRect({ x: coords.x, y: coords.y, width: 0, height: 0 })
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !activeHandle) return
    const coords = getCanvasCoords(e)

    if (activeHandle === 'new') {
      const x = Math.min(dragStart.x, coords.x)
      const y = Math.min(dragStart.y, coords.y)
      const width = Math.abs(coords.x - dragStart.x)
      const height = Math.abs(coords.y - dragStart.y)
      setCropRect({ x, y, width, height })
      return
    }

    if (!initialCropRect) return

    if (activeHandle === 'move') {
      const dx = coords.x - dragStart.x
      const dy = coords.y - dragStart.y
      setCropRect({
        x: Math.max(0, initialCropRect.x + dx),
        y: Math.max(0, initialCropRect.y + dy),
        width: initialCropRect.width,
        height: initialCropRect.height
      })
      return
    }

    // Corner Resizing
    if (activeHandle === 'tl') {
      const right = initialCropRect.x + initialCropRect.width
      const bottom = initialCropRect.y + initialCropRect.height
      const newX = Math.min(coords.x, right - 10)
      const newY = Math.min(coords.y, bottom - 10)
      setCropRect({ x: newX, y: newY, width: right - newX, height: bottom - newY })
      return
    }

    if (activeHandle === 'tr') {
      const left = initialCropRect.x
      const bottom = initialCropRect.y + initialCropRect.height
      const newX = Math.max(coords.x, left + 10)
      const newY = Math.min(coords.y, bottom - 10)
      setCropRect({ x: left, y: newY, width: newX - left, height: bottom - newY })
      return
    }

    if (activeHandle === 'bl') {
      const right = initialCropRect.x + initialCropRect.width
      const top = initialCropRect.y
      const newX = Math.min(coords.x, right - 10)
      const newY = Math.max(coords.y, top + 10)
      setCropRect({ x: newX, y: top, width: right - newX, height: newY - top })
      return
    }

    if (activeHandle === 'br') {
      const left = initialCropRect.x
      const top = initialCropRect.y
      const newX = Math.max(coords.x, left + 10)
      const newY = Math.max(coords.y, top + 10)
      setCropRect({ x: left, y: top, width: newX - left, height: newY - top })
      return
    }

    // Side Resizing
    if (activeHandle === 'top') {
      const bottom = initialCropRect.y + initialCropRect.height
      const newY = Math.min(coords.y, bottom - 10)
      setCropRect({ x: initialCropRect.x, y: newY, width: initialCropRect.width, height: bottom - newY })
      return
    }

    if (activeHandle === 'bottom') {
      const top = initialCropRect.y
      const newY = Math.max(coords.y, top + 10)
      setCropRect({ x: initialCropRect.x, y: top, width: initialCropRect.width, height: newY - top })
      return
    }

    if (activeHandle === 'left') {
      const right = initialCropRect.x + initialCropRect.width
      const newX = Math.min(coords.x, right - 10)
      setCropRect({ x: newX, y: initialCropRect.y, width: right - newX, height: initialCropRect.height })
      return
    }

    if (activeHandle === 'right') {
      const left = initialCropRect.x
      const newX = Math.max(coords.x, left + 10)
      setCropRect({ x: left, y: initialCropRect.y, width: newX - left, height: initialCropRect.height })
      return
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setActiveHandle(null)
  }

  // Crop & Save Soru
  const handleCropAndSave = async () => {
    if (!cropRect || cropRect.width < 20 || cropRect.height < 20) {
      alert('Lütfen soru alanını dikdörtgen içine alarak seçin.')
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    // Off-screen canvas for crop
    const cropCanvas = document.createElement('canvas')
    cropCanvas.width = cropRect.width
    cropCanvas.height = cropRect.height

    const ctx = cropCanvas.getContext('2d')
    ctx.drawImage(
      canvas,
      cropRect.x, cropRect.y, cropRect.width, cropRect.height,
      0, 0, cropRect.width, cropRect.height
    )

    const imageBase64 = cropCanvas.toDataURL('image/png')

    setSaving(true)
    setStatusMsg('')

    try {
      await uploadCroppedQuestion({
        imageBase64,
        courseName,
        examType,
        year: selectedYear,
        correctOption,
        explanation,
        adminUsername: currentUser?.username,
      })

      setStatusMsg('✓ Soru başarıyla kaydedildi!')
      setExplanation('')
      setCropRect(null)
      if (onQuestionAdded) onQuestionAdded()
    } catch (err) {
      alert('Soru kaydedilemedi: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // Add Dynamic Year
  const handleAddNewYear = async () => {
    if (!newYearInput.trim()) return
    try {
      const res = await createYear(newYearInput.trim())
      await loadYearsList()
      setSelectedYear(res.year)
      setNewYearInput('')
      setShowAddYearModal(false)
    } catch (err) {
      alert('Yıl eklenemedi: ' + err.message)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ── PDF Yükleme Alanı ── */}
      <div className="admin__stat-card" style={{ gap: '16px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-neutral-dark)' }}>
          📄 PDF Sınav Dosyası Yükle
        </h3>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ fontSize: '14px' }}
          />
          {pdfDoc && (
            <span style={{ fontSize: '13px', color: 'var(--color-neutral-mid)' }}>
              {numPages} sayfalık PDF yüklendi
            </span>
          )}
        </div>
      </div>

      {pdfDoc && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
          
          {/* Sol: PDF Canvas & Selection */}
          <div className="admin__stat-card" style={{ padding: '16px', overflowX: 'auto' }}>
            
            {/* Sayfa İleri / Geri Navigasyon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <button
                type="button"
                className="btn btn--ghost"
                disabled={pageNum <= 1}
                onClick={() => setPageNum(p => Math.max(1, p - 1))}
                style={{ minHeight: '36px', padding: '4px 12px', fontSize: '13px' }}
              >
                ← Önceki Sayfa
              </button>

              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-neutral-dark)' }}>
                Sayfa {pageNum} / {numPages}
              </span>

              <button
                type="button"
                className="btn btn--ghost"
                disabled={pageNum >= numPages}
                onClick={() => setPageNum(p => Math.min(numPages, p + 1))}
                style={{ minHeight: '36px', padding: '4px 12px', fontSize: '13px' }}
              >
                Sonraki Sayfa →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-neutral-mid)', margin: 0 }}>
                  💡 Fareniz ile soruyu kapsayacak şekilde sürükleyip bir alan çizin.
                </p>
                {cropRect && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    style={{ padding: '2px 8px', fontSize: '11px', minHeight: '24px', color: '#ef4444', border: '1px solid #fca5a5' }}
                    onClick={() => setCropRect(null)}
                  >
                    ✕ Seçimi Temizle
                  </button>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn--primary"
                  style={{ background: 'var(--color-accent)', padding: '6px 12px', fontSize: '13px', minHeight: '32px' }}
                  onClick={handleAiDetect}
                  disabled={aiDetecting}
                >
                  {aiDetecting ? 'Analiz Ediliyor...' : '✨ Sayfayı Analiz Et (Deneysel AI)'}
                </button>

                {detectedBoxes.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {detectedBoxes.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(255, 255, 255, 0.9)',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          border: '1px solid var(--color-blue-accent)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn--ghost"
                          style={{ padding: '2px 6px', fontSize: '12px', minHeight: '28px', border: 'none', fontWeight: 600, color: 'var(--color-blue-accent)' }}
                          onClick={() => setCropRect(item.box)}
                        >
                          Soru {item.questionNumber}
                        </button>
                        <span style={{ fontSize: '11px', color: '#999' }}>#</span>
                        <input
                          type="text"
                          value={item.questionNumber}
                          onChange={(e) => {
                            const val = e.target.value
                            setDetectedBoxes(prev => prev.map((b, i) => i === index ? { ...b, questionNumber: val } : b))
                          }}
                          style={{
                            width: '28px',
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '1px 2px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: '#fff'
                          }}
                          title="Soru numarasını düzenlemek için tıklayın"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Canvas Stack */}
            <div style={{ position: 'relative', border: '1px solid #ccc', borderRadius: '8px', display: 'inline-block', cursor: 'crosshair', userSelect: 'none' }}>
              <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />
              <canvas
                ref={overlayCanvasRef}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
              />
            </div>

          </div>

          {/* Sağ: Soru Metadata Formu & Kırp/Kaydet */}
          <div className="admin__stat-card" style={{ position: 'sticky', top: '20px', gap: '16px' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-neutral-dark)' }}>
              ✂️ Soru Bilgileri ve Kayıt
            </h4>

            <div className="admin__edit-field">
              <label className="admin__edit-label">Ders (Sabit Liste)</label>
              <select
                className="admin__edit-input"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              >
                <option value="Arapça-2">Arapça-2</option>
                <option value="Arapça-4">Arapça-4</option>
              </select>
            </div>

            <div className="admin__edit-field">
              <label className="admin__edit-label">Sınav Türü</label>
              <select
                className="admin__edit-input"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
              >
                <option value="Dönem Sonu">Dönem Sonu</option>
                <option value="Yaz Okulu">Yaz Okulu</option>
              </select>
            </div>

            <div className="admin__edit-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="admin__edit-label">Yıl</label>
                <button
                  type="button"
                  onClick={() => setShowAddYearModal(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-blue-accent)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  + Yeni Yıl Ekle
                </button>
              </div>
              <select
                className="admin__edit-input"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {availableYears.map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <div className="admin__edit-field">
              <label className="admin__edit-label">Doğru Şık</label>
              <select
                className="admin__edit-input"
                value={correctOption}
                onChange={(e) => setCorrectOption(e.target.value)}
              >
                {['A', 'B', 'C', 'D', 'E'].map(opt => (
                  <option key={opt} value={opt}>{opt} Şıkkı</option>
                ))}
              </select>
            </div>

            <div className="admin__edit-field">
              <label className="admin__edit-label">Eğitici Açıklama (Opsiyonel)</label>
              <textarea
                className="admin__edit-input"
                rows={3}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Soru çözüm açıklaması..."
                style={{ resize: 'vertical' }}
              />
            </div>

            {statusMsg && (
              <p style={{ color: 'var(--color-accent)', fontSize: '13px', fontWeight: 600, margin: 0 }}>
                {statusMsg}
              </p>
            )}

            <button
              type="button"
              className="btn btn--primary btn--full"
              onClick={handleCropAndSave}
              disabled={saving}
            >
              {saving ? 'Kaydediliyor…' : '✂️ Seçilen Alanı Kırp ve Kaydet'}
            </button>
          </div>

        </div>
      )}

      {/* Dynamic Year Modal */}
      {showAddYearModal && (
        <div className="admin__confirm-overlay">
          <div className="admin__confirm-dialog" style={{ maxWidth: '340px' }}>
            <h3 className="admin__confirm-title">Yeni Yıl Ekle</h3>
            <p className="admin__confirm-text" style={{ fontSize: '13px' }}>
              Eklenen yıl soru kayıt formlarında anında görünür olacaktır (örnek: 2027 veya 2026-2027).
            </p>
            <input
              type="text"
              className="admin__edit-input"
              value={newYearInput}
              onChange={(e) => setNewYearInput(e.target.value)}
              placeholder="örn: 2027"
              autoFocus
            />
            <div className="admin__confirm-actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setShowAddYearModal(false)}
              >
                İptal
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleAddNewYear}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default PdfQuestionCropper
