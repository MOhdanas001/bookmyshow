import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';
import { ArrowRight, CalendarDays, Check, ChevronDown, Clapperboard, Clock3, CreditCard, Film, Heart, MapPin, Menu, Search, Settings2, ShieldCheck, Ticket, UserRound, Users, X, Zap } from 'lucide-react';
import { useCancelBooking, useCreateBooking, useGetMovie, useListMovies, useListMyBookings, useListShows, useListTheatres, useLogin, useRegister } from '@workspace/api-client-react';
import type { Booking, Movie, Show, Theatre } from '@workspace/api-client-react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import './index.css';

const queryClient = new QueryClient();
const posterA = 'https://image.tmdb.org/t/p/w780/6mJrgK3z5oGQyH2V5W5n5Z0xB3n.jpg';
const posterB = 'https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg';
const posterC = 'https://image.tmdb.org/t/p/w780/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg';
const posterD = 'https://image.tmdb.org/t/p/w780/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg';
const backdrop = 'https://image.tmdb.org/t/p/w1280/9l1eZiJHmhr5jIlthMdJN5WYoff.jpg';

const demoMovies: Movie[] = [
  { id: 'midnight-archive', title: 'The Midnight Archive', posterUrl: posterA, backdropUrl: backdrop, rating: 8.7, votes: '12.4k', genres: ['Mystery', 'Drama'], language: 'English', duration: '2h 08m', releaseDate: '2025-04-18', synopsis: 'A sound archivist discovers a reel recorded tomorrow, and follows its impossible clues through one sleepless city.', status: 'now-showing', accent: '#d8a45e' },
  { id: 'glass-house', title: 'Glass House', posterUrl: posterB, backdropUrl: backdrop, rating: 8.2, votes: '8.1k', genres: ['Thriller', 'Drama'], language: 'English', duration: '1h 54m', releaseDate: '2025-04-25', synopsis: 'A family gathering turns into a beautiful, brittle portrait of what people keep from each other.', status: 'now-showing', accent: '#a6c0c2' },
  { id: 'after-the-rain', title: 'After the Rain', posterUrl: posterC, backdropUrl: backdrop, rating: 7.9, votes: '6.8k', genres: ['Romance', 'Indie'], language: 'French', duration: '1h 46m', releaseDate: '2025-05-02', synopsis: 'Two strangers share a coat, a long walk, and the kind of afternoon that changes a life.', status: 'now-showing', accent: '#d68978' },
  { id: 'orbiting', title: 'Orbiting', posterUrl: posterD, backdropUrl: backdrop, rating: 8.5, votes: '4.7k', genres: ['Sci-Fi', 'Adventure'], language: 'English', duration: '2h 20m', releaseDate: '2025-05-16', synopsis: 'On the edge of a vanished planet, a cartographer maps the space between memory and gravity.', status: 'coming-soon', accent: '#8ca0d5' },
];
const demoTheatres: Theatre[] = [
  { id: 'aurora', name: 'Aurora Picturehouse', location: 'Mission District', formats: ['35mm', 'Dolby Atmos', 'Subtitled'] },
  { id: 'parlor', name: 'The Parlor Cinema', location: 'Hayes Valley', formats: ['Laser', 'Dolby Atmos'] },
  { id: 'lumiere', name: 'Lumière Hall', location: 'North Beach', formats: ['70mm', '35mm'] },
];
const demoShows: Show[] = [
  { id: 'show-1', movieId: 'midnight-archive', theatreId: 'aurora', theatreName: 'Aurora Picturehouse', location: 'Mission District', format: '35mm', date: '2025-05-18', startTime: '11:20 AM', price: 16, availableSeats: 42, category: 'morning' },
  { id: 'show-2', movieId: 'midnight-archive', theatreId: 'aurora', theatreName: 'Aurora Picturehouse', location: 'Mission District', format: 'Dolby Atmos', date: '2025-05-18', startTime: '4:40 PM', price: 19, availableSeats: 18, category: 'afternoon' },
  { id: 'show-3', movieId: 'midnight-archive', theatreId: 'parlor', theatreName: 'The Parlor Cinema', location: 'Hayes Valley', format: 'Laser', date: '2025-05-18', startTime: '7:15 PM', price: 18, availableSeats: 27, category: 'evening' },
  { id: 'show-4', movieId: 'midnight-archive', theatreId: 'lumiere', theatreName: 'Lumière Hall', location: 'North Beach', format: '70mm', date: '2025-05-19', startTime: '9:45 PM', price: 22, availableSeats: 9, category: 'night' },
  { id: 'show-5', movieId: 'glass-house', theatreId: 'parlor', theatreName: 'The Parlor Cinema', location: 'Hayes Valley', format: 'Dolby Atmos', date: '2025-05-18', startTime: '6:30 PM', price: 18, availableSeats: 31, category: 'evening' },
];

function useDemoData<T>(data: T | undefined, fallback: T): T {
  if (Array.isArray(fallback)) {
    return (Array.isArray(data) && data.length > 0 ? data : fallback) as T;
  }
  return data ?? fallback;
}
function money(value: number) { return `$${value.toFixed(2)}`; }
function dateLabel(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const id = window.setTimeout(onClose, 3200); return () => window.clearTimeout(id); }, [onClose]);
  return <div className="toast" role="status" data-testid="status-toast">{message}<button onClick={onClose} data-testid="button-close-toast"><X size={15} /></button></div>;
}

function Logo() {
  return <Link href="/" className="logo" data-testid="link-home"><span className="logo-mark"><Clapperboard size={18} /></span><span>reel<span className="logo-dot">.</span>room</span></Link>;
}

function Shell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [location] = useLocation();
  const auth = localStorage.getItem('reelroom_user');
  const nav = [{ href: '/', label: 'Discover' }, { href: '/bookings', label: 'My tickets' }, { href: '/profile', label: 'Profile' }];
  return <div className="app-shell">
    <header className="topbar">
      <Logo />
      <nav className={`main-nav ${menu ? 'open' : ''}`}>{nav.map(item => <Link key={item.href} href={item.href} className={location === item.href ? 'active' : ''} onClick={() => setMenu(false)} data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}>{item.label}</Link>)}{auth && JSON.parse(auth)?.role === 'admin' && <Link href="/admin" onClick={() => setMenu(false)} data-testid="link-nav-admin">Workspace</Link>}</nav>
      <div className="top-actions"><Link href={auth ? '/profile' : '/login'} className="avatar-chip" data-testid="link-account"><UserRound size={17} /><span>{auth ? 'Account' : 'Sign in'}</span></Link><button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Open menu" data-testid="button-mobile-menu">{menu ? <X size={20} /> : <Menu size={20} />}</button></div>
    </header>
    <main>{children}</main>
    <footer className="footer"><Logo /><span>Films worth making an evening of.</span><span className="mono">REELROOM / 2025</span></footer>
  </div>;
}

function MoviePoster({ movie, large = false }: { movie: Movie; large?: boolean }) {
  const m = movie as any;
  const movieIdStr = String(m.id || '');
  const genresList = m.genres || m.genre || [];
  const poster = m.posterUrl || m.poster || '';
  return <div className={`poster ${large ? 'poster-large' : ''}`} style={{ '--poster-accent': m.accent || '#d8a45e' } as CSSProperties}><img src={poster} alt={m.title} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} /><div className="poster-fallback"><span className="poster-number">RR / {movieIdStr.slice(0, 2).toUpperCase()}</span><strong>{m.title}</strong><small>{Array.isArray(genresList) ? genresList.join(' · ') : genresList}</small></div><span className="poster-rating">★ {m.rating}</span></div>;
}

function MovieCard({ movie }: { movie: Movie }) {
  const m = movie as any;
  const genresList = m.genres || m.genre || [];
  const durationStr = m.duration || (m.durationMinutes ? `${m.durationMinutes}m` : '2h');
  return <Link href={`/movie/${m.id}`} className="movie-card" data-testid={`card-movie-${m.id}`}><MoviePoster movie={movie} /><div className="movie-card-copy"><h3>{m.title}</h3><p>{Array.isArray(genresList) ? genresList.join(' · ') : genresList} <span>·</span> {durationStr}</p></div></Link>;
}

function SectionHeading({ eyebrow, title, link }: { eyebrow: string; title: string; link?: string }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{link && <Link href={link} className="text-link" data-testid={`link-section-${eyebrow.toLowerCase().replace(' ', '-')}`}>View all <ArrowRight size={15} /></Link>}</div>;
}

function Home() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All films');
  const moviesQuery = useListMovies({ search: search || undefined });
  const movies = useDemoData(moviesQuery.data, demoMovies);
  const filtered = useMemo(() => movies.filter(m => {
    const movieObj = m as any;
    const movieGenres = movieObj.genres || movieObj.genre || [];
    const matchesGenre = genre === 'All films' || (Array.isArray(movieGenres) && movieGenres.includes(genre));
    const matchesSearch = !search || movieObj.title.toLowerCase().includes(search.toLowerCase());
    return matchesGenre && matchesSearch;
  }), [movies, genre, search]);
  const now = filtered.filter(m => m.status !== 'coming-soon');
  const soon = movies.filter(m => m.status === 'coming-soon');
  const displayNow = now.length > 0 ? now : filtered;
  const genres = ['All films', 'Drama', 'Mystery', 'Thriller', 'Sci-Fi', 'Romance', 'Action'];
  return <Shell><section className="hero">
    <div className="hero-copy"><span className="eyebrow warm">THE INDEPENDENT SCREENING ROOM</span><h1>Make an evening<br /><em>of it.</em></h1><p>Find the film that deserves your time, then settle into the right seat. Considered cinema, from first look to final frame.</p><Link href={`/movie/${displayNow[0]?.id ?? demoMovies[0].id}`} className="button button-light" data-testid="button-hero-film">Explore tonight <ArrowRight size={17} /></Link></div>
    <div className="hero-art"><div className="hero-orbit"></div><img src={backdrop} alt="" /><div className="hero-note"><span className="mono">01 / FEATURED TONIGHT</span><strong>The Midnight<br />Archive</strong><span>35mm · Aurora Picturehouse</span></div></div>
  </section>
  <section className="page-section discover-section"><div className="search-row"><div className="search-box"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search films, moods, directors..." data-testid="input-search-movies" /></div><button className="location-pill" data-testid="button-location"><MapPin size={16} /> San Francisco <ChevronDown size={14} /></button></div>
    <div className="genre-row">{genres.map(g => <button key={g} className={`filter-pill ${genre === g ? 'selected' : ''}`} onClick={() => setGenre(g)} data-testid={`button-genre-${g.toLowerCase().replace(' ', '-')}`}>{g}</button>)}</div>
    <SectionHeading eyebrow="On the marquee" title="Now showing" link="/" />
    {moviesQuery.isLoading ? <SkeletonGrid /> : displayNow.length ? <div className="movie-grid">{displayNow.map(movie => <MovieCard movie={movie} key={movie.id} />)}</div> : <EmptyState title="No films found" copy="Try a different title or genre." />}
    <div className="split-feature"><div><SectionHeading eyebrow="A little later" title="Coming soon" /><div className="coming-list">{soon.map(movie => { const m = movie as any; return <Link href={`/movie/${m.id}`} className="coming-item" key={m.id} data-testid={`card-coming-${m.id}`}><MoviePoster movie={movie} /><div><span className="eyebrow">Arriving {dateLabel(m.releaseDate)}</span><h3>{m.title}</h3><p>{Array.isArray(m.genres || m.genre) ? (m.genres || m.genre).join(' · ') : ''}</p></div><ArrowRight size={18} /></Link>; })}</div></div><aside className="editor-note"><span className="eyebrow warm">REELROOM EDITOR'S NOTE</span><h3>“The best seat in the house is the one you chose on purpose.”</h3><p>Our weekly cut of intimate dramas, late-night discoveries, and films with a little staying power.</p><Link href="/?genre=editorial" className="text-link">Read the cut <ArrowRight size={15} /></Link></aside></div>
  </section></Shell>;
}

function SkeletonGrid() { return <div className="movie-grid">{[1, 2, 3, 4].map(i => <div className="skeleton-card" key={i}><div className="skeleton" /><div className="skeleton-line" /><div className="skeleton-line short" /></div>)}</div>; }
function EmptyState({ title, copy }: { title: string; copy: string }) { return <div className="empty-state"><Film size={25} /><h3>{title}</h3><p>{copy}</p></div>; }

function MovieDetail() {
  const { id = '' } = useParams();
  const query = useGetMovie(id, { query: { queryKey: ['/api/v1/movies', id], retry: false } });
  const movie = query.data ?? demoMovies.find(m => m.id === id) ?? demoMovies[0];
  return <Shell><section className="detail-hero" style={{ '--accent': movie.accent } as CSSProperties}><div className="detail-backdrop" style={{ backgroundImage: `url(${movie.backdropUrl})` }} /><div className="detail-content"><MoviePoster movie={movie} large /><div className="detail-copy"><span className="eyebrow warm">{movie.status === 'now-showing' ? 'NOW SHOWING' : 'COMING SOON'}</span><h1>{movie.title}</h1><div className="meta-line"><span className="rating">★ {movie.rating}</span><span>{movie.votes} ratings</span><span>{movie.duration}</span><span>{movie.language}</span></div><p>{movie.synopsis}</p><div className="tag-row">{movie.genres.map(g => <span key={g}>{g}</span>)}</div>{movie.status === 'now-showing' ? <Link href={`/shows/${movie.id}`} className="button button-accent" data-testid="button-find-showtimes">Find showtimes <ArrowRight size={17} /></Link> : <button className="button button-muted" data-testid="button-remind-me"><Heart size={16} /> Remind me</button>}</div></div></section><section className="page-section detail-info"><div className="fact-card"><span className="eyebrow">The short version</span><p>{movie.synopsis}</p></div><div className="fact-card"><span className="eyebrow">Release notes</span><p>{dateLabel(movie.releaseDate)}<br />{movie.language} · {movie.duration}</p></div></section></Shell>;
}

function getNext5Dates() {
  const dates: { dateStr: string; label: string; dayNum: string; monthName: string }[] = [];
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    dates.push({
      dateStr,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()],
      dayNum: String(d.getDate()),
      monthName: months[d.getMonth()],
    });
  }
  return dates;
}

function Shows() {
  const { movieId = '' } = useParams();
  const movie = demoMovies.find(m => String(m.id) === String(movieId)) ?? demoMovies[0];
  const query = useListShows({ movieId });
  const shows = useDemoData(query.data, demoShows.filter(s => String(s.movieId) === String(movieId)).length ? demoShows.filter(s => String(s.movieId) === String(movieId)) : demoShows.slice(0, 4));
  const next5 = useMemo(() => getNext5Dates(), []);
  const [selectedDate, setSelectedDate] = useState(next5[0].dateStr);
  const grouped = ['morning', 'afternoon', 'evening', 'night'];
  return <Shell><section className="page-section shows-page"><div className="breadcrumb"><Link href={`/movie/${movie.id}`}>← {movie.title}</Link><span>/</span><span>Showtimes</span></div><div className="shows-intro"><div><span className="eyebrow">Choose your moment</span><h1>Find a screening.</h1><p>One film, several ways to make a night of it.</p></div><MoviePoster movie={movie} /></div><div className="date-strip">{next5.map((item) => <button className={`date-card ${selectedDate === item.dateStr ? 'selected' : ''}`} key={item.dateStr} onClick={() => setSelectedDate(item.dateStr)} data-testid={`button-date-${item.dateStr}`}><span>{item.label}</span><strong>{item.dayNum}</strong><small>{item.monthName}</small></button>)}</div>{grouped.map(category => { const list = shows.filter(s => (s as any).category === category || category === 'evening'); return list.length ? <div className="show-group" key={category}><div className="show-time-heading"><Clock3 size={16} /><span>{category}</span><i /></div>{list.map(show => { const s = show as any; return <Link href={`/seats/${s.id}?date=${selectedDate}`} onClick={() => sessionStorage.setItem('selected_show_date', selectedDate)} className="show-row" key={s.id} data-testid={`card-show-${s.id}`}><div className="show-venue"><strong>{s.theatreName || 'Aurora Picturehouse'}</strong><span><MapPin size={13} /> {s.location || 'San Francisco'}</span></div><span className="format">{s.format || '2D'}</span><span className="show-time">{s.startTime || s.showTime || '19:15'}</span><span className="show-price">{money(s.price || s.ticketPrice || 18)}</span><ArrowRight size={17} /></Link>; })}</div> : null; })}</section></Shell>;
}

function Seats() {
  const { showId = '' } = useParams();
  const show = demoShows.find(s => String(s.id) === String(showId)) ?? demoShows[0];
  const movie = demoMovies.find(m => String(m.id) === String(show.movieId)) ?? demoMovies[0];
  const [selected, setSelected] = useState<string[]>([]);
  const [location, setLocation] = useLocation();
  const booked = useMemo(() => new Set(['A4', 'A5', 'B2', 'B3', 'C7', 'D1', 'D2', 'D3', 'E8', 'F6', 'F7']), []);
  const seats = Array.from({ length: 8 }, (_, r) => Array.from({ length: 10 }, (_, c) => `${String.fromCharCode(65 + r)}${c + 1}`));
  const toggle = (seat: string) => setSelected(s => s.includes(seat) ? s.filter(x => x !== seat) : s.length < 6 ? [...s, seat] : s);
  const total = selected.length * show.price;
  const selectedDate = sessionStorage.getItem('selected_show_date') || (show as any).date || new Date().toISOString().split('T')[0];
  const next = () => { sessionStorage.setItem('reelroom_checkout', JSON.stringify({ show: { ...show, date: selectedDate }, movie, seats: selected })); setLocation('/booking-summary'); };
  return <Shell><section className="page-section seat-page"><div className="breadcrumb"><Link href={`/shows/${movie.id}`}>← Showtimes</Link><span>/</span><span>Select seats</span></div><div className="seat-header"><div><span className="eyebrow">{show.theatreName} · {show.format}</span><h1>Choose your seats.</h1><p>{dateLabel(selectedDate)} · {show.startTime}</p></div><div className="seat-legend"><span><i className="seat-dot available" />Available</span><span><i className="seat-dot selected-dot" />Selected</span><span><i className="seat-dot booked-dot" />Taken</span></div></div><div className="seat-layout"><div className="screen"><span>SCREEN</span></div><div className="seat-grid">{seats.map(row => row.map(seat => <button key={seat} disabled={booked.has(seat)} onClick={() => toggle(seat)} className={`seat ${booked.has(seat) ? 'booked' : selected.includes(seat) ? 'selected' : ''}`} data-testid={`button-seat-${seat}`}>{seat.slice(1)}</button>))}</div><div className="seat-rows"><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span><span>H</span></div></div><div className="seat-summary"><div><span className="eyebrow">Your selection</span><strong>{selected.length ? selected.join(' · ') : 'No seats selected'}</strong><small>Up to 6 seats per booking</small></div><div className="summary-price"><span>{selected.length} tickets</span><strong>{money(total)}</strong></div><button className="button button-dark" disabled={!selected.length} onClick={next} data-testid="button-continue-seats">Continue <ArrowRight size={17} /></button></div></section></Shell>;
}

function CheckoutSummary() {
  const [, setLocation] = useLocation();
  const checkout = JSON.parse(sessionStorage.getItem('reelroom_checkout') || 'null');
  if (!checkout) return <Shell><section className="page-section"><EmptyState title="Your evening is waiting" copy="Choose a showtime to start a booking." /><Link href="/" className="button button-dark">Browse films</Link></section></Shell>;
  const fee = 2.5; const subtotal = checkout.seats.length * checkout.show.price;
  return <Shell><section className="page-section checkout-page"><div className="breadcrumb"><Link href={`/seats/${checkout.show.id}`}>← Seats</Link><span>/</span><span>Review</span></div><div className="checkout-grid"><div><span className="eyebrow">Almost there</span><h1>Review your<br /><em>evening.</em></h1><div className="review-film"><MoviePoster movie={checkout.movie} /><div><h3>{checkout.movie.title}</h3><p>{checkout.show.theatreName}<br />{dateLabel(checkout.show.date)} · {checkout.show.startTime}<br />{checkout.show.format}</p></div></div><div className="ticket-line"><span>Seats</span><strong>{checkout.seats.join(' · ')}</strong></div></div><div className="price-card"><span className="eyebrow">Booking summary</span><div className="price-row"><span>{checkout.seats.length} × General admission</span><strong>{money(subtotal)}</strong></div><div className="price-row"><span>Booking care</span><strong>{money(fee)}</strong></div><div className="price-total"><span>Total</span><strong>{money(subtotal + fee)}</strong></div><button className="button button-accent full" onClick={() => setLocation('/payment')} data-testid="button-proceed-payment"><CreditCard size={17} /> Continue to payment</button><small className="secure-note"><ShieldCheck size={14} /> Secure checkout · no surprises</small></div></div></section></Shell>;
}

function Payment() {
  const [, setLocation] = useLocation(); const checkout = JSON.parse(sessionStorage.getItem('reelroom_checkout') || 'null'); const create = useCreateBooking(); const [busy, setBusy] = useState(false);
  if (!checkout) return <Shell><section className="page-section"><EmptyState title="No booking to pay for" copy="Choose a film and seats first." /><Link href="/" className="button button-dark">Browse films</Link></section></Shell>;
  const pay = (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const authHeader = localStorage.getItem('reelroom_token') || localStorage.getItem('bms_token');
    const numericShowId = Number(checkout.show.id);
    const payload = { showId: isNaN(numericShowId) ? 1 : numericShowId, seatNumbers: checkout.seats.join(','), bookingDate: checkout.show.date };
    fetch('http://localhost:8080/api/v1/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: `Bearer ${authHeader}` } : {}),
      },
      body: JSON.stringify(payload),
    })
      .then(async res => {
        if (res.ok) {
          const json = await res.json();
          const bData = json.data || json;
          sessionStorage.setItem('reelroom_booking', JSON.stringify({
            id: bData.bookingId || bData.id || 'demo',
            bookingId: bData.bookingReference || `RR-${Math.floor(100000 + Math.random() * 899999)}`,
            movieId: checkout.movie.id,
            movieTitle: checkout.movie.title,
            posterUrl: checkout.movie.posterUrl,
            theatreName: checkout.show.theatreName,
            date: checkout.show.date,
            time: checkout.show.startTime,
            seats: checkout.seats,
            status: 'confirmed',
            totalAmount: bData.amount || (checkout.seats.length * checkout.show.price + 2.5),
          }));
          setLocation('/booking-success');
        } else {
          throw new Error('Backend booking failed');
        }
      })
      .catch(() => {
        const fallback = {
          id: 'demo',
          bookingId: `RR-${Math.floor(100000 + Math.random() * 899999)}`,
          movieId: checkout.movie.id,
          movieTitle: checkout.movie.title,
          posterUrl: checkout.movie.posterUrl,
          theatreName: checkout.show.theatreName,
          date: checkout.show.date,
          time: checkout.show.startTime,
          seats: checkout.seats,
          status: 'confirmed',
          ticketPrice: checkout.seats.length * checkout.show.price,
          convenienceFee: 2.5,
          totalAmount: checkout.seats.length * checkout.show.price + 2.5,
        };
        sessionStorage.setItem('reelroom_booking', JSON.stringify(fallback));
        setLocation('/booking-success');
      })
      .finally(() => setBusy(false));
  };
  return <Shell><section className="page-section payment-page"><div className="breadcrumb"><Link href="/booking-summary">← Review</Link><span>/</span><span>Payment</span></div><div className="payment-grid"><div><span className="eyebrow">The final frame</span><h1>Make it<br /><em>official.</em></h1><p className="lead">A dummy payment for the preview. Your seats are held while you complete this form.</p><form className="payment-form" onSubmit={pay}><label>Card number<input required placeholder="4242 4242 4242 4242" inputMode="numeric" data-testid="input-card-number" /></label><div className="form-two"><label>Expiry<input required placeholder="MM / YY" data-testid="input-card-expiry" /></label><label>Security code<input required placeholder="CVC" data-testid="input-card-cvc" /></label></div><label>Name on card<input required placeholder="Your full name" data-testid="input-card-name" /></label><button className="button button-accent full" disabled={busy} data-testid="button-pay">{busy ? 'Confirming your seats...' : `Pay ${money(checkout.seats.length * checkout.show.price + 2.5)}`} <ArrowRight size={17} /></button></form></div><div className="payment-aside"><Ticket size={28} /><span className="eyebrow">Tonight's plan</span><h3>{checkout.movie.title}</h3><p>{checkout.show.theatreName}<br />{dateLabel(checkout.show.date)} · {checkout.show.startTime}<br />Seats {checkout.seats.join(', ')}</p><div className="aside-rule" /><span className="secure-note"><ShieldCheck size={14} /> Encrypted and intentionally simple</span></div></div></section></Shell>;
}

function Success() {
  const booking = JSON.parse(sessionStorage.getItem('reelroom_booking') || 'null') as Booking | null;
  const fallback = booking ?? { bookingId: 'RR-204819', movieTitle: 'The Midnight Archive', theatreName: 'Aurora Picturehouse', date: '2025-05-18', time: '7:15 PM', seats: ['E4', 'E5'], totalAmount: 38.5, posterUrl: posterA };
  return <Shell><section className="page-section success-page"><div className="success-mark"><Check size={27} /></div><span className="eyebrow warm">YOU'RE ON THE LIST</span><h1>See you<br /><em>in the dark.</em></h1><p className="lead">Your seats are held. We saved the details below for the door.</p><div className="ticket"><div className="ticket-main"><div className="ticket-top"><span className="mono">REELROOM / ADMIT ONE</span><Ticket size={22} /></div><MoviePoster movie={demoMovies.find(m => m.title === fallback.movieTitle) ?? demoMovies[0]} /><div className="ticket-details"><h2>{fallback.movieTitle}</h2><p>{fallback.theatreName}</p><div className="ticket-meta"><span><CalendarDays size={14} />{dateLabel(fallback.date)}</span><span><Clock3 size={14} />{fallback.time}</span><span><Ticket size={14} />{fallback.seats.join(' · ')}</span></div></div></div><div className="ticket-stub"><div className="qr">{Array.from({ length: 36 }, (_, i) => <i key={i} style={{ opacity: (i * 17) % 5 === 0 ? .2 : 1 }} />)}</div><span className="mono">{fallback.bookingId}</span></div></div><div className="success-actions"><Link href="/bookings" className="button button-dark" data-testid="button-view-bookings">View my tickets</Link><Link href="/" className="text-link" data-testid="link-book-more">Book another film <ArrowRight size={15} /></Link></div></section></Shell>;
}

function Bookings() {
  const query = useListMyBookings(); const cancel = useCancelBooking(); const [toast, setToast] = useState(''); const fallback: Booking[] = [{ id: 'b1', bookingId: 'RR-204819', movieId: 'midnight-archive', movieTitle: 'The Midnight Archive', posterUrl: posterA, theatreName: 'Aurora Picturehouse', date: '2025-05-18', time: '7:15 PM', seats: ['E4', 'E5'], status: 'confirmed', ticketPrice: 36, convenienceFee: 2.5, totalAmount: 38.5 }]; const bookings = useDemoData(query.data, fallback);
  const doCancel = (booking: Booking) => { if (!window.confirm('Cancel this booking?')) return; cancel.mutate({ id: booking.id }, { onSuccess: () => setToast('Booking cancelled.'), onError: () => setToast('Demo mode: cancellation recorded locally.') }); };
  return <Shell><section className="page-section bookings-page"><div className="page-title-row"><div><span className="eyebrow">Your reelroom</span><h1>My tickets.</h1><p>A small archive of good nights out.</p></div><Link href="/" className="button button-dark" data-testid="button-new-booking">Book a film <ArrowRight size={17} /></Link></div><div className="booking-list">{query.isLoading ? <SkeletonGrid /> : bookings.map(booking => <div className={`booking-card ${booking.status === 'cancelled' ? 'cancelled' : ''}`} key={booking.id} data-testid={`card-booking-${booking.id}`}><MoviePoster movie={demoMovies.find(m => m.id === booking.movieId) ?? demoMovies[0]} /><div className="booking-copy"><span className="eyebrow">{booking.status === 'confirmed' ? 'CONFIRMED' : 'CANCELLED'} · {booking.bookingId}</span><h3>{booking.movieTitle}</h3><p>{booking.theatreName}<br />{dateLabel(booking.date)} · {booking.time}<br />Seats {booking.seats.join(' · ')}</p></div><div className="booking-actions"><strong>{money(booking.totalAmount)}</strong>{booking.status === 'confirmed' && <button className="text-button danger" onClick={() => doCancel(booking)} data-testid={`button-cancel-${booking.id}`}>Cancel booking</button>}</div></div>)}</div>{toast && <Toast message={toast} onClose={() => setToast('')} />}</section></Shell>;
}

function Profile() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('reelroom_user') || '{"name":"Guest viewer","email":"guest@reelroom.test","role":"user"}')); const [toast, setToast] = useState('');
  const save = (e: FormEvent) => { e.preventDefault(); localStorage.setItem('reelroom_user', JSON.stringify(user)); setToast('Preferences saved.'); };
  return <Shell><section className="page-section profile-page"><div className="page-title-row"><div><span className="eyebrow">Your viewing profile</span><h1>{user.name}.</h1><p>Make Reelroom feel a little more like yours.</p></div><div className="profile-avatar">{user.name?.slice(0, 1).toUpperCase()}</div></div><form className="profile-card" onSubmit={save}><div className="profile-section"><span className="eyebrow">Personal details</span><label>Name<input value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} data-testid="input-profile-name" /></label><label>Email<input value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} data-testid="input-profile-email" /></label></div><div className="profile-section"><span className="eyebrow">Your preferences</span>{['Send me weekly film notes', 'Remember my neighborhood', 'Default to accessible screenings'].map((item, i) => <label className="check-row" key={item}><input type="checkbox" defaultChecked={i < 2} data-testid={`input-preference-${i}`} /><span>{item}</span><Check size={16} /></label>)}</div><button className="button button-dark" data-testid="button-save-profile">Save preferences <Check size={16} /></button></form><button className="text-button danger signout" onClick={() => { localStorage.removeItem('reelroom_user'); window.location.href = '/'; }} data-testid="button-sign-out">Sign out</button>{toast && <Toast message={toast} onClose={() => setToast('')} />}</section></Shell>;
}

function Auth({ mode }: { mode: 'login' | 'register' }) {
  const [, setLocation] = useLocation(); const login = useLogin(); const register = useRegister(); const [form, setForm] = useState({ name: '', email: '', password: '' }); const [error, setError] = useState('');
  const submit = (e: FormEvent) => { e.preventDefault(); setError(''); const mutation = mode === 'login' ? login : register; const data = mode === 'login' ? { email: form.email, password: form.password } : form; mutation.mutate({ data } as never, { onSuccess: (result: any) => { localStorage.setItem('reelroom_token', result.token); localStorage.setItem('reelroom_user', JSON.stringify(result.user)); setLocation('/'); }, onError: () => { if (mode === 'login') { localStorage.setItem('reelroom_user', JSON.stringify({ name: form.email.split('@')[0], email: form.email, role: 'user' })); localStorage.setItem('reelroom_token', 'preview-token'); setLocation('/'); } else setError('Please check your details and try again.'); } }); };
  return <div className="auth-page"><div className="auth-art"><Logo /><div><span className="eyebrow warm">A CINEMA COMPANION</span><h1>Good films<br /><em>stay with you.</em></h1><p>Discover the next one worth leaving the house for.</p></div><span className="mono">REELROOM / SAN FRANCISCO</span></div><div className="auth-panel"><Link href="/" className="mobile-auth-logo"><Logo /></Link><span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'JOIN THE ROOM'}</span><h2>{mode === 'login' ? 'Pick up where you left off.' : 'Make room for good films.'}</h2><p>{mode === 'login' ? 'Your saved tickets and favorite screens are waiting.' : 'A better way to plan a night at the cinema.'}</p><form className="auth-form" onSubmit={submit}>{mode === 'register' && <label>Your name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} data-testid="input-register-name" /></label>}<label>Email address<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} data-testid={`input-${mode}-email`} /></label><label>Password<input type="password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} data-testid={`input-${mode}-password`} /></label>{error && <div className="form-error">{error}</div>}<button className="button button-dark full" disabled={login.isPending || register.isPending} data-testid={`button-submit-${mode}`}>{mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={17} /></button></form><p className="auth-switch">{mode === 'login' ? 'New to Reelroom?' : 'Already have an account?'} <Link href={mode === 'login' ? '/register' : '/login'} data-testid="link-auth-switch">{mode === 'login' ? 'Create an account' : 'Sign in'}</Link></p></div></div>;
}

function Admin() {
  const [active, setActive] = useState('Overview'); const movies = useDemoData(useListMovies().data, demoMovies); const theatres = useDemoData(useListTheatres().data, demoTheatres); const shows = useDemoData(useListShows().data, demoShows); const bookings = useDemoData(useListMyBookings().data, [] as Booking[]);
  const items = [{ label: 'Overview', icon: Zap }, { label: 'Movies', icon: Film }, { label: 'Theatres', icon: Clapperboard }, { label: 'Shows', icon: CalendarDays }, { label: 'Bookings', icon: Ticket }, { label: 'Users', icon: Users }, { label: 'Settings', icon: Settings2 }];
  return <div className="admin-layout"><aside className="admin-sidebar"><Logo /><span className="admin-label">WORKSPACE</span>{items.map(({ label, icon: Icon }) => <button key={label} className={active === label ? 'active' : ''} onClick={() => setActive(label)} data-testid={`button-admin-${label.toLowerCase()}`}><Icon size={17} />{label}</button>)}<div className="admin-side-bottom"><Link href="/" data-testid="link-back-to-reelroom">← Back to Reelroom</Link></div></aside><main className="admin-main"><div className="admin-top"><div><span className="eyebrow">SATURDAY, MAY 17, 2025</span><h1>{active}.</h1></div><div className="admin-user">RR <span>Studio admin</span></div></div>{active === 'Overview' ? <><div className="metric-grid"><div><span>Tickets sold</span><strong>1,284</strong><small>+12.8% this week</small></div><div><span>Gross revenue</span><strong>$24,968</strong><small>+8.4% this week</small></div><div><span>Occupancy</span><strong>78.4%</strong><small>Across 3 screens</small></div><div><span>Active shows</span><strong>{shows.length + 24}</strong><small>Tonight</small></div></div><div className="admin-grid"><div className="admin-table-card"><div className="table-header"><h3>Tonight's shows</h3><button className="text-link" onClick={() => setActive('Shows')} data-testid="button-view-all-shows">View all <ArrowRight size={14} /></button></div>{shows.slice(0, 4).map(s => <div className="admin-row" key={s.id}><span className="admin-time">{s.startTime}</span><div><strong>{demoMovies.find(m => m.id === s.movieId)?.title ?? 'Film screening'}</strong><small>{s.theatreName} · {s.format}</small></div><span className="occupancy">{100 - s.availableSeats}% full</span></div>)}</div><div className="admin-table-card accent-card"><span className="eyebrow warm">A QUICK NOTE</span><h2>The room is<br /><em>looking good.</em></h2><p>Weekend occupancy is up across every screen. The 7:15 PM slot is your sweet spot.</p><button className="button button-light" onClick={() => setActive('Shows')} data-testid="button-manage-schedule">Manage schedule <ArrowRight size={15} /></button></div></div></> : <div className="admin-table-card full-table"><div className="table-header"><h3>{active}</h3><button className="button button-dark" data-testid="button-admin-add">Add {active.slice(0, -1).toLowerCase()} <ArrowRight size={14} /></button></div>{(active === 'Movies' ? movies : active === 'Theatres' ? theatres : active === 'Shows' ? shows : active === 'Bookings' ? bookings : items.slice(0, 4)).map((item: any, i) => <div className="admin-row" key={item.id ?? i}><div><strong>{item.title ?? item.name ?? item.movieTitle ?? item.label}</strong><small>{item.genres?.join(' · ') ?? item.location ?? item.theatreName ?? 'Workspace item'}</small></div><span className="occupancy">{item.rating ? `★ ${item.rating}` : item.status ?? 'Active'}</span></div>)}</div>}</main></div>;
}

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/movie/:id" component={MovieDetail} /><Route path="/shows/:movieId" component={Shows} /><Route path="/seats/:showId" component={Seats} /><Route path="/booking-summary" component={CheckoutSummary} /><Route path="/payment" component={Payment} /><Route path="/booking-success" component={Success} /><Route path="/bookings" component={Bookings} /><Route path="/profile" component={Profile} /><Route path="/login"><Auth mode="login" /></Route><Route path="/register"><Auth mode="register" /></Route><Route path="/admin" component={Admin} /><Route component={NotFound} /></Switch>; }
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;