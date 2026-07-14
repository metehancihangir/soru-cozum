/**
 * Soru Çözüm — Quiz akışı (Arapça-2)
 * 5 boş şablon; metinleri sonra doldurun.
 * correct: 0–3 (A–D)
 */
(function () {
  'use strict';

  var KEYS = ['A', 'B', 'C', 'D'];

  /**
   * Boş şablonlar — prompt/options metinlerini buraya yazın.
   * correct: doğru şık indeksi (0=A, 1=B, 2=C, 3=D)
   */
  var QUESTIONS = [
    {
      prompt: '[سُؤال ١]',
      options: ['[Şık A]', '[Şık B]', '[Şık C]', '[Şık D]'],
      correct: 0
    },
    {
      prompt: '[سُؤال ٢]',
      options: ['[Şık A]', '[Şık B]', '[Şık C]', '[Şık D]'],
      correct: 1
    },
    {
      prompt: '[سُؤال ٣]',
      options: ['[Şık A]', '[Şık B]', '[Şık C]', '[Şık D]'],
      correct: 2
    },
    {
      prompt: '[سُؤال ٤]',
      options: ['[Şık A]', '[Şık B]', '[Şık C]', '[Şık D]'],
      correct: 3
    },
    {
      prompt: '[سُؤال ٥]',
      options: ['[Şık A]', '[Şık B]', '[Şık C]', '[Şık D]'],
      correct: 0
    }
  ];

  var TOTAL_LABEL = 100; /* UI sayacı: Soru X / 100 (brief) */
  var useLabelTotal = true;

  var state = {
    index: 0,
    answered: false,
    score: 0
  };

  var els = {
    screen: document.getElementById('quiz-screen'),
    complete: document.getElementById('complete-screen'),
    counter: document.getElementById('quiz-counter'),
    progress: document.getElementById('quiz-progress-bar'),
    prompt: document.getElementById('quiz-prompt'),
    options: document.getElementById('quiz-options'),
    next: document.getElementById('quiz-next'),
    score: document.getElementById('complete-score')
  };

  function isPlaceholder(text) {
    return !text || /^\[.*\]$/.test(String(text).trim());
  }

  function renderQuestion() {
    var q = QUESTIONS[state.index];
    if (!q) return;

    state.answered = false;

    var total = useLabelTotal ? TOTAL_LABEL : QUESTIONS.length;
    els.counter.textContent = 'Soru ' + (state.index + 1) + ' / ' + total;

    var pct = ((state.index) / QUESTIONS.length) * 100;
    els.progress.style.width = pct + '%';

    els.prompt.textContent = q.prompt;
    els.prompt.classList.toggle('is-placeholder', isPlaceholder(q.prompt));

    els.options.innerHTML = '';
    q.options.forEach(function (label, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.dataset.index = String(i);
      btn.setAttribute('data-od-id', 'option-' + KEYS[i].toLowerCase());
      btn.innerHTML =
        '<span class="option__key" aria-hidden="true">' + KEYS[i] + '</span>' +
        '<span class="option__label">' + escapeHtml(label) + '</span>';
      btn.addEventListener('click', function () {
        onSelect(i);
      });
      els.options.appendChild(btn);
    });

    els.next.classList.remove('is-visible');
    var isLast = state.index >= QUESTIONS.length - 1;
    els.next.innerHTML = isLast
      ? 'Bitir <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>'
      : 'Sonraki Soru <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function onSelect(choice) {
    if (state.answered) return;
    state.answered = true;

    var q = QUESTIONS[state.index];
    var buttons = els.options.querySelectorAll('.option');
    var correct = q.correct;

    buttons.forEach(function (btn, i) {
      btn.disabled = true;
      if (i === correct) {
        btn.classList.add('is-correct');
      } else if (i === choice && choice !== correct) {
        btn.classList.add('is-wrong');
      }
    });

    if (choice === correct) state.score += 1;

    els.next.classList.add('is-visible');
  }

  function goNext() {
    if (!state.answered) return;

    if (state.index >= QUESTIONS.length - 1) {
      showComplete();
      return;
    }

    state.index += 1;
    renderQuestion();
  }

  function showComplete() {
    els.screen.classList.add('is-hidden');
    els.complete.classList.add('is-visible');
    els.score.textContent = state.score + ' / ' + QUESTIONS.length + ' doğru';
    els.progress.style.width = '100%';
  }

  if (els.next) {
    els.next.addEventListener('click', goNext);
  }

  if (els.prompt && els.options) {
    renderQuestion();
  }
})();
