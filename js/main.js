'use strict'

const form = document.getElementById('age-form')
const dayEl = document.getElementById('day')
const monthEl = document.getElementById('month')
const yearEl = document.getElementById('year')

const yearsOut = document.getElementById('years')
const monthsOut = document.getElementById('months')
const daysOut = document.getElementById('days')

function daysInMonth(y, mIdx0) {
  return new Date(y, mIdx0 + 1, 0).getDate()
}

form.addEventListener('submit', (ev) => {
  ev.preventDefault()

  const day = dayEl.value ? Number(dayEl.value) : null
  const month = monthEl.value ? Number(monthEl.value) : null
  const year = yearEl.value ? Number(yearEl.value) : null

  if (!day || !month || !year) {
    yearsOut.textContent = '--'
    monthsOut.textContent = '--'
    daysOut.textContent = '--'
    return
  }

  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth() // 0..11
  const todayDay = today.getDate()

  // --- Year ---
  let years = todayYear - year
  const hadBirthdayThisYear =
    todayMonth > month - 1 || (todayMonth === month - 1 && todayDay >= day)
  if (!hadBirthdayThisYear) years--

  // --- Month ---
  let months = todayMonth - (month - 1)
  if (todayDay < day) months -= 1
  if (months < 0) months += 12

  // --- Days ---
  let days

  if (todayDay >= day) {
    days = todayDay - day
  } else {
    let prevMonthIdx = todayMonth - 1
    let prevmonthYear = todayYear
    if (prevMonthIdx < 0) {
      prevMonthIdx = 11
      prevmonthYear--
    }

    const dim = daysInMonth(prevmonthYear, prevMonthIdx)
    days = todayDay + dim - day

    months -= 1
    if (months < 0) {
      months += 12
      years -= 1
    }
  }

  yearsOut.textContent = String(years)
  monthsOut.textContent = String(months)
  daysOut.textContent = String(days)
})
