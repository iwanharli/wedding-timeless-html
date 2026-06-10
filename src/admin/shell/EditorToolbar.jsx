import { NO_SAVE_VIEWS, NO_PREVIEW_TOGGLE_VIEWS } from './editorConstants'

export default function EditorToolbar({
  activeId,
  activeLabel,
  canSave,
  status,
  saving,
  onSave,
  onRevert,
  onToggleSidebar,
  previewVisible,
  onTogglePreview,
}) {
  return (
    <header className="edit-toolbar">
      <div className="edit-toolbar-left">
        <button
          type="button"
          className="edit-hamburger"
          onClick={onToggleSidebar}
          title="Toggle menu"
        >
          <i className="fas fa-bars" />
        </button>
        <span className="edit-toolbar-title">{activeLabel}</span>
        {canSave && (
          <span className="edit-unsaved-badge">Unsaved changes</span>
        )}
      </div>
      <div className="edit-toolbar-right">
        {!NO_SAVE_VIEWS.has(activeId) && (
          <div className="edit-toolbar-save-wrap">
            {status && (
              <span className={`edit-status-toast edit-status-toast--${status.type}`}>
                {status.message}
              </span>
            )}
            {canSave && (
              <button
                type="button"
                className="edit-revert-btn"
                onClick={onRevert}
                disabled={saving}
                title="Batalkan perubahan section ini"
              >
                <i className="fas fa-undo" />
                <span className="edit-save-btn-label">Revert</span>
              </button>
            )}
            <button
              type="button"
              className="edit-save-btn"
              onClick={onSave}
              disabled={saving || !canSave}
            >
              {saving
                ? <><i className="fas fa-circle-notch fa-spin" /> <span className="edit-save-btn-label">Saving…</span></>
                : <><i className="fas fa-save" /> <span className="edit-save-btn-label">Save changes</span></>}
            </button>
          </div>
        )}

        {!NO_PREVIEW_TOGGLE_VIEWS.has(activeId) && (
          <button
            type="button"
            className={`edit-preview-toggle-btn${previewVisible ? ' active' : ''}`}
            onClick={onTogglePreview}
            title={previewVisible ? 'Hide preview' : 'Show mobile preview'}
          >
            <i className="fas fa-mobile-alt" />
          </button>
        )}
      </div>
    </header>
  )
}
