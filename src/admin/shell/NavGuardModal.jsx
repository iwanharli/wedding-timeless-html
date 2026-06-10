// Confirmation modal shown when navigating away from a section with unsaved changes
export default function NavGuardModal({ activeLabel, saving, onSave, onDiscard, onCancel }) {
  return (
    <div className="edit-nav-guard-backdrop" onClick={onCancel}>
      <div className="edit-nav-guard-modal" onClick={e => e.stopPropagation()}>
        <div className="edit-nav-guard-icon">
          <i className="fas fa-exclamation-triangle" />
        </div>
        <h3 className="edit-nav-guard-title">Perubahan belum disimpan</h3>
        <p className="edit-nav-guard-desc">
          Kamu akan meninggalkan <strong>{activeLabel}</strong>. Perubahan yang belum disimpan akan hilang jika tidak disimpan terlebih dahulu.
        </p>
        <div className="edit-nav-guard-actions">
          <button
            type="button"
            className="edit-nav-guard-btn edit-nav-guard-btn--save"
            onClick={onSave}
            disabled={saving}
          >
            {saving
              ? <><i className="fas fa-circle-notch fa-spin" /> Menyimpan…</>
              : <><i className="fas fa-save" /> Simpan &amp; Lanjut</>}
          </button>
          <button
            type="button"
            className="edit-nav-guard-btn edit-nav-guard-btn--discard"
            onClick={onDiscard}
          >
            <i className="fas fa-trash-alt" /> Buang Perubahan
          </button>
          <button
            type="button"
            className="edit-nav-guard-btn edit-nav-guard-btn--cancel"
            onClick={onCancel}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}
