import { useEffect, useRef, useState } from 'react'
import { MAP } from './americaMap.js'

// ✏️ PERSONALIZA AQUÍ
const NOMBRE_TUYO = 'Gerson Meneses'
const NOMBRE_CORTO = 'Gerson'
const AUDIO_SRC = '/music.mp3' // coloca tu archivo en la carpeta public/ con este nombre
const MENSAJE = [
  'Elena, es curioso cómo empezó todo. Te vi en Facebook compartiendo memes y pensé que eras una especie de influencer. Un día me animé a escribirte y, desde entonces, no hemos dejado de conversar.',
  'Con el tiempo intercambiamos números y los años pasaron sin que lo notáramos. Hoy me resulta difícil imaginarme sin tu amistad. Gracias por escucharme siempre y por acompañarme en mis historias.',
  'Sé que tu camino no ha sido sencillo y, aun así, sigues aquí, siendo una pequeña luz para quienes te rodean: los niños de la asociación donde sirves, quienes escuchan tu guitarra y tu voz, y todos los que tienen la suerte de conocerte. Yo soy agnóstico, pero cada vez que me hablas de Dios, tus palabras me llenan de ternura.',
  'No sé si te has dado cuenta, pero eso es lo que más admiro de ti: eres de esas personas que dan calidez al alma.',
  'Espero de corazón que falte poco para conocerte en persona. Mientras tanto, feliz cumpleaños, Elena🤍 . Que todo lo bueno que repartes vuelva a ti multiplicado x1000.',
]
const FLY = Array.from({ length: 10 }, (_, i) => ({
  l: (i * 23 + 4) % 92, s: 26 + (i % 4) * 9, t: 16 + (i % 5) * 3, d: -(i * 2.7), sw: 3 + (i % 3), v: i % 3,
}))
const FLAKES = Array.from({ length: 16 }, (_, i) => ({ l: (i * 29 + 5) % 96, d: ((i * 0.7) % 5).toFixed(1), s: 4 + (i % 4) * 2, t: 4 + (i % 5) }))

function Butterfly({ className = '', style, ...rest }) {
  const wing = (
    <g className="wing">
      <path className="up" d="M50 40C30 4 2 8 8 32c4 16 24 20 42 10z" />
      <path className="lo" d="M50 42C32 50 18 72 34 74c12 1 16-16 16-32z" />
      <circle className="dot" cx="22" cy="26" r="4.5" />
      <circle className="dot" cx="31" cy="62" r="3" />
    </g>
  )
  return (
    <svg className={`butterfly ${className}`} style={style} viewBox="0 0 100 80" aria-hidden="true" {...rest}>
      {wing}
      <g transform="translate(100 0) scale(-1 1)">{wing}</g>
      <path className="ant" d="M49 30C46 20 42 16 38 14M51 30C54 20 58 16 62 14" />
      <ellipse className="body" cx="50" cy="42" rx="2.2" ry="14" />
    </svg>
  )
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold: 0.25 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`rv ${on ? 'in' : ''} ${className}`}>{children}</div>
}

function glideTo(el, ms = 2400) {
  const y = el.getBoundingClientRect().top + window.scrollY - 24
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return window.scrollTo(0, y)
  const y0 = window.scrollY, t0 = performance.now()
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const step = (now) => {
    const t = Math.min((now - t0) / ms, 1)
    window.scrollTo(0, y0 + (y - y0) * ease(t))
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

const STARS = Array.from({ length: 34 }, (_, i) => ({ l: (i * 37 + 11) % 100, t: (i * 53 + 7) % 100, d: ((i * 0.41) % 4).toFixed(2), s: 2 + (i % 3) }))
const FLOATERS = [
  { l: 6, t: 14, s: 46, d: 0, k: 9, v: 0 }, { l: 84, t: 10, s: 58, d: 1.2, k: 11, v: 1 },
  { l: 72, t: 50, s: 34, d: 2.4, k: 8, v: 2 }, { l: 14, t: 62, s: 40, d: 0.6, k: 10, v: 1 },
  { l: 46, t: 6, s: 28, d: 3, k: 12, v: 2 }, { l: 90, t: 76, s: 44, d: 1.8, k: 9, v: 0 },
]

export default function App() {
  const [open, setOpen] = useState(false)
  const [burst, setBurst] = useState([])
  const [playing, setPlaying] = useState(false)
  const [audioOk, setAudioOk] = useState(true)
  const audio = useRef(null)
  const carta = useRef(null)

  const mover = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    e.currentTarget.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }

  const abrir = () => {
    setOpen(true)
    setBurst(Array.from({ length: 26 }, (_, i) => ({
      id: i, x: 30 + Math.random() * 40, dx: (Math.random() - 0.5) * 110, dy: -(70 + Math.random() * 60),
      s: 26 + Math.random() * 34, r: (Math.random() - 0.5) * 40, d: Math.random() * 1.4, t: 4 + Math.random() * 2.5, v: i % 3,
    })))
    audio.current?.play().then(() => setPlaying(true)).catch(() => {})
    setTimeout(() => carta.current && glideTo(carta.current), 900)
    setTimeout(() => setBurst([]), 8500)
  }

  const toggleAudio = () => {
    const a = audio.current
    if (!a) return
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {})
    else { a.pause(); setPlaying(false) }
  }

  return (
    <main>
      <audio ref={audio} src={AUDIO_SRC} loop preload="auto" onError={() => setAudioOk(false)} />

      <section className="hero" onPointerMove={mover}>
        {STARS.map((s, i) => (
          <span key={i} className="star" style={{ left: s.l + '%', top: s.t + '%', width: s.s, height: s.s, animationDelay: s.d + 's' }} />
        ))}
        {FLOATERS.map((f, i) => (
          <Butterfly key={i} className={`float v${f.v}`}
            style={{ left: f.l + '%', top: f.t + '%', width: f.s, animationDelay: f.d + 's', '--k': f.k + 's' }} />
        ))}
        <div className="halo" />
        <div className="hero-content">
          <div className="bf-wrap"><Butterfly className={`hero-bf ${open ? 'takeoff' : ''}`} /></div>
          <p className="kicker">Para Elena</p>
          <h1>Feliz<br />cumpleaños</h1>
          <p className="sub">Una amistad que cruza fronteras<br />y se siente cerca.</p>
          {!open
            ? <button className="btn" onClick={abrir}>Abrir mi mensaje</button>
            : <button className="btn ghost" onClick={() => glideTo(carta.current)}>Ir al mensaje</button>}
        </div>
      </section>

      {burst.map((b) => (
        <Butterfly key={b.id} className={`burst v${b.v}`}
          style={{ left: b.x + '%', width: b.s, '--dx': b.dx + 'vw', '--dy': b.dy + 'vh', '--r': b.r + 'deg', '--d': b.d + 's', '--t': b.t + 's' }} />
      ))}

      {open && (
        <>
          <section className="carta" id="carta" ref={carta}>
            <div className="fly-layer" aria-hidden="true">
              {FLY.map((f, i) => (
                <span key={i} className="fly" style={{ left: f.l + '%', animationDuration: f.t + 's', animationDelay: f.d + 's' }}>
                  <Butterfly className={`v${f.v}`} style={{ width: f.s, '--sw': f.sw + 's' }} />
                </span>
              ))}
            </div>
            <Reveal><h2 className="para">Para ti, Elena</h2></Reveal>
            {MENSAJE.map((p, i) => <Reveal key={i}><p>{p}</p></Reveal>)}
            <Reveal><p className="firma">Con cariño,<br /><strong>{NOMBRE_TUYO}</strong></p></Reveal>
          </section>

          <section className="duo">
            <Reveal className="duo-grid">
              <div className="panel snow">
                {FLAKES.map((f, i) => <span key={i} className="flake" style={{ left: f.l + '%', width: f.s, height: f.s, animationDelay: f.d + 's', animationDuration: f.t + 's' }} />)}
                <p>Tú conoces la nieve</p>
              </div>
              <div className="panel sea">
                <svg className="waves" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
                  <path className="w1" d="M0 20Q25 4 50 20T100 20T150 20T200 20T250 20T300 20T350 20T400 20V40H0Z" />
                  <path className="w2" d="M0 26Q25 12 50 26T100 26T150 26T200 26T250 26T300 26T350 26T400 26V40H0Z" />
                </svg>
                <p>Y Yo conozco el mar</p>
              </div>
            </Reveal>
            <Reveal><p className="duo-txt">Algún día quiero que me cuentes de la nieve en persona y que vos conozcas el mar.</p></Reveal>
          </section>

          <section className="bendicion">
            <Reveal>
              <Butterfly className="mini v1" />
              <blockquote>“El Señor te bendiga y te guarde.”</blockquote>
              <cite>Números 6:24</cite>
            </Reveal>
          </section>

          <section className="mapa-sec">
            <Reveal>
              <h2>De Perú a México</h2>
              <p className="mapa-sub">Tan lejos en el mapa, tan cerca en el corazón.</p>
            </Reveal>
            <Reveal>
              <svg className="mapa" viewBox={MAP.viewBox} role="img" aria-label="Mapa de América con una mariposa volando de Perú a México">
                <path className="land" d={MAP.rest} />
                <path className="land peru" d={MAP.peru} />
                <path className="land mexico" d={MAP.mexico} />
                <path id="ruta" className="route-base" d={MAP.route} />
                <path className="trail" d={MAP.route} pathLength="1" />
                {[MAP.lima, MAP.cdmx].map(([x, y], i) => (
                  <g key={i} transform={`translate(${x} ${y})`}>
                    <circle className="ping" r="5" style={{ animationDelay: i * 0.8 + 's' }} />
                    <circle className="pin" r="5" />
                  </g>
                ))}
                <text className="lbl" x={MAP.lima[0] - 14} y={MAP.lima[1] + 6} textAnchor="end">
                  Perú<tspan className="who" x={MAP.lima[0] - 14} dy="22">{NOMBRE_CORTO}</tspan>
                </text>
                <text className="lbl" x={MAP.cdmx[0] - 14} y={MAP.cdmx[1] + 6} textAnchor="end">
                  México<tspan className="who" x={MAP.cdmx[0] - 14} dy="22">Elena</tspan>
                </text>
                <g>
                  <animateMotion dur="9s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines=".45 0 .55 1">
                    <mpath href="#ruta" />
                  </animateMotion>
                  <Butterfly className="trav" x="-26" y="-21" width="52" height="42" />
                </g>
              </svg>
            </Reveal>
            <Reveal><p className="km">Más de 4,200 km de distancia, y aun así seguimos cerca.</p></Reveal>
          </section>

          <footer>Hecho con cariño por Gerson Meneses 💜</footer>
        </>
      )}

      {open && audioOk && (
        <button className={`music ${playing ? 'on' : ''}`} onClick={toggleAudio}
          aria-label={playing ? 'Pausar música' : 'Reproducir música'}>
          <i /><i /><i />
        </button>
      )}
    </main>
  )
}
