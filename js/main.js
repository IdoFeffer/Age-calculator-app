'use strict'

const form = document.getElementById('age-form')
const dayEl = document.getElementById('day')
const monthEl = document.getElementById('month')
const yearEl = document.getElementById('year')

const yearsOut = document.getElementById('years')
const monthsOut = document.getElementById('months')
const daysOut = document.getElementById('days')

const dayField = dayEl.closest('.field')
const monthField = monthEl.closest('.field')
const yearField = yearEl.closest('.field')

const dayErr = document.getElementById('day-error')
const monthErr = document.getElementById('month-error')
const yearErr = document.getElementById('year-error')

function isRealDate(d, m, y) {
  const dt = new Date(y, m - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
}

function setDateGroupError(msg) {
  setError(dayField, dayEl, dayErr, msg)
  setError(monthField, monthEl, monthErr, msg)
  setError(yearField, yearEl, yearErr, msg)
}

function daysInMonth(y, mIdx0) {
  return new Date(y, mIdx0 + 1, 0).getDate()
}

function setError(fieldDiv, inputEl, msgEl, msg) {
  fieldDiv.classList.add('has-error')
  inputEl.setAttribute('aria-invalid', 'true')
  if (msgEl) msgEl.textContent = msg
}
function clearError(fieldDiv, inputEl, msgEl) {
  fieldDiv.classList.remove('has-error')
  inputEl.removeAttribute('aria-invalid')
  if (msgEl) msgEl.textContent = ''
}
function resetErrors() {
  clearError(dayField, dayEl, dayErr)
  clearError(monthField, monthEl, monthErr)
  clearError(yearField, yearEl, yearErr)
}
function showResult(y = '--', m = '--', d = '--') {
  yearsOut.textContent = String(y)
  monthsOut.textContent = String(m)
  daysOut.textContent = String(d)
}

form.addEventListener('submit', (ev) => {
  ev.preventDefault()
  resetErrors()
  showResult() // מציב -- כברירת מחדל

  const day = dayEl.value ? Number(dayEl.value) : null
  const month = monthEl.value ? Number(monthEl.value) : null
  const year = yearEl.value ? Number(yearEl.value) : null

  // ---- ולידציות בסיס ----
  let hasError = false

  // Required
  if (!day) {
    setError(dayField, dayEl, dayErr, 'This field is required')
    hasError = true
  }
  if (!month) {
    setError(monthField, monthEl, monthErr, 'This field is required')
    hasError = true
  }
  if (!year) {
    setError(yearField, yearEl, yearErr, 'This field is required')
    hasError = true
  }

  // טווחים כלליים
  if (day !== null && (day < 1 || day > 31)) {
    setError(dayField, dayEl, dayErr, 'Must be a valid day')
    hasError = true
  }
  if (month !== null && (month < 1 || month > 12)) {
    setError(monthField, monthEl, monthErr, 'Must be a valid month')
    hasError = true
  }

  if (hasError) return // ← למשל month=13 ייעצר כאן וידליק חיווי אדום

  // ---- ולידציות תלויות חודש/שנה ----
  const today = new Date()
  // ---- ולידציה משותפת: התאריך חייב להיות אמיתי בלוח השנה ----
  if (!isRealDate(day, month, year)) {
    setDateGroupError('Must be a valid date') // מסמן את שלושתם
    return showResult() // נשאר עם -- --
  }

  const birthDate = new Date(year, month - 1, day)
  if (birthDate > today) {
    setError(yearField, yearEl, yearErr, 'Must be in the past')
    return
  }

  // ---- חישוב גיל ----
  const tY = today.getFullYear()
  const tM = today.getMonth() // 0..11
  const tD = today.getDate()

  // שנים
  let years = tY - year
  const hadBirthdayThisYear = tM > month - 1 || (tM === month - 1 && tD >= day)
  if (!hadBirthdayThisYear) years--

  // חודשים
  let months = tM - (month - 1)
  if (tD < day) months -= 1
  if (months < 0) months += 12

  // ימים
  let days
  if (tD >= day) {
    days = tD - day
  } else {
    let prevMonthIdx = tM - 1,
      prevMonthYear = tY
    if (prevMonthIdx < 0) {
      prevMonthIdx = 11
      prevMonthYear--
    }
    const dimPrev = daysInMonth(prevMonthYear, prevMonthIdx)
    days = tD + dimPrev - day
    months -= 1
    if (months < 0) {
      months += 12
      years -= 1
    }
  }

  showResult(years, months, days)
})
