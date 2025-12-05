import { useLanguage } from "../LanguageContext"
import './LanguageToggle.css'

function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="language-toggle">
      <button
        className={`lang-btn ${language === 'de' ? 'active' : ''}`}
        onClick={() => setLanguage('de')}
        title="Deutsch"
      >
        🇩🇪 DE
      </button>
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
        title="English"
      >
        🇬🇧 EN
      </button>
    </div>
  )
}

export default LanguageToggle

