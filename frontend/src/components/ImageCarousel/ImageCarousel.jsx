import { useState } from 'react';

const PLACEHOLDER = 'https://via.placeholder.com/400x400?text=No+Image';

export default function ImageCarousel({ images = [] }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const list = images.length ? images : [PLACEHOLDER];
  const total = list.length;

  function prev() { setActive((i) => (i - 1 + total) % total); }
  function next() { setActive((i) => (i + 1) % total); }

  return (
    <div style={styles.root}>

      {/* ── Thumbnail strip ── */}
      <div style={styles.thumbs}>
        {list.map((src, i) => (
          <div
            key={i}
            style={{ ...styles.thumb, ...(i === active ? styles.thumbActive : {}) }}
            onClick={() => setActive(i)}
          >
            <img src={src} alt={`thumb-${i}`} style={styles.thumbImg} />
          </div>
        ))}
      </div>

      {/* ── Main image ── */}
      <div style={styles.mainWrap}>
        {total > 1 && (
          <button style={{ ...styles.arrow, left: '6px' }} onClick={prev}>&#8249;</button>
        )}

        <div
          style={{ ...styles.imgBox, cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
          onClick={() => setZoomed((z) => !z)}
        >
          <img
            src={list[active]}
            alt="product"
            style={{ ...styles.mainImg, ...(zoomed ? styles.mainImgZoomed : {}) }}
          />
          {!zoomed && total > 1 && (
            <p style={styles.hint}>Click to zoom</p>
          )}
        </div>

        {total > 1 && (
          <button style={{ ...styles.arrow, right: '6px' }} onClick={next}>&#8250;</button>
        )}
      </div>

      {/* ── Dot indicators ── */}
      {total > 1 && (
        <div style={styles.dots}>
          {list.map((_, i) => (
            <span
              key={i}
              style={{ ...styles.dot, ...(i === active ? styles.dotActive : {}) }}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  root:     { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' },
  thumbs:   { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' },
  thumb:    { width: '56px', height: '56px', border: '1px solid #e0e0e0', borderRadius: '4px', cursor: 'pointer', padding: '4px', background: '#fafafa' },
  thumbActive: { borderColor: '#2874f0', boxShadow: '0 0 0 2px #2874f033' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'contain' },
  mainWrap: { position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  arrow:    { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1.4rem', lineHeight: '30px', textAlign: 'center', zIndex: 1, color: '#212121', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' },
  imgBox:   { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '340px', aspectRatio: '1', overflow: 'hidden', background: '#fff', border: '1px solid #f0f0f0', borderRadius: '4px' },
  mainImg:  { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.2s' },
  mainImgZoomed: { transform: 'scale(1.7)' },
  hint:     { fontSize: '0.72rem', color: '#878787', marginTop: '0.4rem' },
  dots:     { display: 'flex', gap: '6px' },
  dot:      { width: '8px', height: '8px', borderRadius: '50%', background: '#d0d0d0', cursor: 'pointer' },
  dotActive: { background: '#2874f0' },
};
