import { useMemo, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { ZOOM_OPTIONS } from './ChartSetup'
import { useChartTheme } from '../hooks/useTheme'

export default function AvgScoreTrendChart({ entries }) {
  const ct = useChartTheme()
  const chartRef = useRef(null)
  const [zoomed, setZoomed] = useState(false)

  const { data, options } = useMemo(() => {
    const byDate = {}
    entries.forEach(e => {
      if (e.score === null) return
      if (!byDate[e.date]) byDate[e.date] = []
      byDate[e.date].push(e.score)
    })
    const dates = Object.keys(byDate).sort()
    return {
      data: {
        datasets: [{
          label: 'Average Score',
          data: dates.map(d => ({
            x: d,
            y: byDate[d].reduce((a, b) => a + b, 0) / byDate[d].length,
          })),
          borderColor: '#58a6ff',
          backgroundColor: '#58a6ff33',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: { unit: 'day' },
            ticks: { color: ct.text2 },
            grid: { color: ct.grid, lineWidth: 1, borderDash: [4, 4] },
          },
          y: {
            min: 0, max: 1,
            ticks: { color: ct.text2 },
            grid: { color: ct.grid },
          },
        },
        plugins: {
          legend: { labels: { color: ct.text } },
          zoom: {
            ...ZOOM_OPTIONS,
            zoom: {
              ...ZOOM_OPTIONS.zoom,
              onZoomComplete: () => setZoomed(true),
            },
          },
        },
      },
    }
  }, [entries, ct])

  const resetZoom = () => {
    chartRef.current?.resetZoom()
    setZoomed(false)
  }

  return (
    <>
      <div className="chart-container">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      {zoomed && (
        <button className="reset-zoom-btn" onClick={resetZoom}>Reset Zoom</button>
      )}
    </>
  )
}
