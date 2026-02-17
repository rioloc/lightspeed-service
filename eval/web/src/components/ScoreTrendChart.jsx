import { useMemo, useRef, useState } from 'react'
import { Line, getElementAtEvent } from 'react-chartjs-2'
import { COLORS, ZOOM_OPTIONS } from './ChartSetup'
import { useChartTheme } from '../hooks/useTheme'

export default function ScoreTrendChart({ entries, onDataClick }) {
  const ct = useChartTheme()
  const chartRef = useRef(null)
  const [zoomed, setZoomed] = useState(false)

  const { data, options, metricsList } = useMemo(() => {
    const metricsSet = [...new Set(entries.map(e => e.metric))].sort()
    const datasets = metricsSet.map((metric, i) => {
      const metricEntries = entries.filter(e => e.metric === metric && e.score !== null)
      const byDate = {}
      metricEntries.forEach(e => {
        if (!byDate[e.date]) byDate[e.date] = []
        byDate[e.date].push(e.score)
      })
      const dates = Object.keys(byDate).sort()
      return {
        label: metric,
        data: dates.map(d => ({
          x: d,
          y: byDate[d].reduce((a, b) => a + b, 0) / byDate[d].length,
        })),
        borderColor: COLORS[i % COLORS.length],
        backgroundColor: COLORS[i % COLORS.length] + '33',
        fill: false,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 8,
      }
    })

    return {
      data: { datasets },
      metricsList: metricsSet,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onHover: (event, elements) => {
          event.native.target.style.cursor = elements.length ? 'pointer' : 'default'
        },
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

  const handleClick = (event) => {
    if (!chartRef.current || !onDataClick) return
    const elements = getElementAtEvent(chartRef.current, event)
    if (!elements.length) return
    const { datasetIndex, index } = elements[0]
    const point = data.datasets[datasetIndex].data[index]
    const metric = metricsList[datasetIndex]
    onDataClick({ date: point.x, metric })
  }

  return (
    <>
      <div className="chart-container">
        <Line ref={chartRef} data={data} options={options} onClick={handleClick} />
      </div>
      {zoomed && (
        <button className="reset-zoom-btn" onClick={resetZoom}>Reset Zoom</button>
      )}
    </>
  )
}
