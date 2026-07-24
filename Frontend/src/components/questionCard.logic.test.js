import assert from 'node:assert/strict'
import test from 'node:test'

import {
  OPTION_LETTERS,
  getNextButtonText,
  getOptionButtonClass,
} from './questionCard.logic.js'

// ── OPTION_LETTERS ──────────────────────────────────────────
test('OPTION_LETTERS returns A through E', () => {
  assert.deepEqual(OPTION_LETTERS, ['A', 'B', 'C', 'D', 'E'])
})

// ── getOptionButtonClass ────────────────────────────────────
test('returns default class before an answer is selected', () => {
  assert.equal(
    getOptionButtonClass({
      option: 'A',
      isAnswered: false,
      selectedOption: null,
      correctOption: 'B',
    }),
    'option'
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
    'option is-correct'
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
    'option is-wrong'
  )

  assert.equal(
    getOptionButtonClass({
      option: 'B',
      isAnswered: true,
      selectedOption: 'A',
      correctOption: 'B',
    }),
    'option is-correct'
  )
})

test('unselected, non-correct options remain plain after answer', () => {
  assert.equal(
    getOptionButtonClass({
      option: 'C',
      isAnswered: true,
      selectedOption: 'A',
      correctOption: 'B',
    }),
    'option'
  )
})

// ── getNextButtonText ───────────────────────────────────────
test('returns next and finish button labels by question position', () => {
  assert.equal(getNextButtonText(0, 5), 'Sonraki Soru')
  assert.equal(getNextButtonText(4, 5), 'Testi Bitir')
})
