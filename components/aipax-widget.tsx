'use client'

import { useEffect, useRef } from 'react'

const AIPAX_SRC =
  'https://aipax.eu/scripts/aipax-enrolment-widget.v1.js?v=20260505'
const AIPAX_FORM_ID = '5f7b99af-6154-4e74-92f7-2be9066a38f6'
const CONTAINER_ID = 'aipax-enrolment-container'

// Widget zapisów AIPAX (system rezerwacji klubu). Skrypt wstawiamy imperatywnie
// przy każdym montażu, bo inicjalizuje się tylko w momencie wykonania — przy
// nawigacji klienckiej Next nie wykonałby go ponownie i kontener zostałby pusty.
export function AipaxWidget() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const script = document.createElement('script')
    script.src = AIPAX_SRC
    script.async = true
    script.setAttribute('data-aipax-form-id', AIPAX_FORM_ID)
    script.setAttribute('data-aipax-locale', 'pl')
    script.setAttribute('data-aipax-container-id', CONTAINER_ID)
    host.appendChild(script)

    return () => {
      host.innerHTML = `<div id="${CONTAINER_ID}"></div>`
    }
  }, [])

  return (
    <div ref={hostRef}>
      <div id={CONTAINER_ID} />
    </div>
  )
}
