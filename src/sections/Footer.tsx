export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '48px clamp(24px, 5vw, 80px)',
      }}
    >
      <div className="max-content flex items-center justify-center">
        <p
          className="text-[13px]"
          style={{ color: 'var(--text-secondary)' }}
        >
          &copy; 2025 Velixa Virtual Assistance. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
