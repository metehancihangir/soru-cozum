import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getNextButtonText,
  getOptionButtonClass,
  getVisibleOptions,
} from './questionCard.logic.js'

const question = {
  questionText: 'ما معنى كلمة كتاب؟',
  optionA: 'قلم',
  optionB: 'كتاب',
  optionC: 'مدرسة',
  optionD: 'بيت',
  optionE: null,
  correctOption: 'B',
  explanation: 'كلمة كتاب تعني kitap.',
}

test('returns default class before an answer is selected', () => {
  assert.equal(
    getOptionButtonClass({
      option: 'A',
      isAnswered: false,
      selectedOption: null,
      correctOption: 'B',
    }),
    'option-btn'
  )
})

test('marks the correct option after a correct answer', () => {
  assert.equal(
    getOptionButtonClass({
      option: 'B',
      isAnswered: true,
      selectedOption: 'B',
      correctOption: 'B',
    }),
    'option-btn correct'
  )
})

test('marks selected wrong option and keeps correct option visible', () => {
  assert.equal(
    getOptionButtonClass({
      option: 'A',
      isAnswered: true,
      selectedOption: 'A',
      correctOption: 'B',
    }),
    'option-btn wrong'
  )

  assert.equal(
    getOptionButtonClass({
      option: 'B',
      isAnswered: true,
      selectedOption: 'A',
      correctOption: 'B',
    }),
    'option-btn correct'
  )
})

test('filters out empty optional options', () => {
  assert.deepEqual(getVisibleOptions(question), [
    { option: 'A', text: 'قلم' },
    { option: 'B', text: 'كتاب' },
    { option: 'C', text: 'مدرسة' },
    { option: 'D', text: 'بيت' },
  ])
})

test('returns next and finish button labels by question position', () => {
  assert.equal(getNextButtonText(0, 5), 'Sonraki Soru →')
  assert.equal(getNextButtonText(4, 5), 'Testi Bitir 🎉')
})
