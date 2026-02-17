import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import 'chartjs-adapter-date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  zoomPlugin
)

export const ZOOM_OPTIONS = {
  zoom: {
    drag: {
      enabled: true,
      backgroundColor: 'rgba(88,166,255,0.1)',
      borderColor: 'rgba(88,166,255,0.4)',
      borderWidth: 1,
    },
    mode: 'x',
  },
}

export const COLORS = [
  '#58a6ff', '#3fb950', '#f85149', '#d29922', '#bc8cff',
  '#f778ba', '#79c0ff', '#7ee787', '#ffa657', '#ff7b72',
]

export const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#e6edf3' } },
  },
  scales: {
    x: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } },
    y: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } },
  },
}
