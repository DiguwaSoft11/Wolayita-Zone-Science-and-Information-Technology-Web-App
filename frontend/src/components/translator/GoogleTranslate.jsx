{/*import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(addScript);
    
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
        'google_translate_element'
      );
    };
  }, []);

  return <div id="google_translate_element"></div>;
}*/}


import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(addScript);
    
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,am', // Only English and Amharic
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };

    // Hide the Google Translate toolbar
    const hideToolbar = () => {
      const toolbar = document.querySelector('.goog-te-banner-frame');
      if (toolbar) {
        toolbar.style.display = 'none';
      }
    };
    setTimeout(hideToolbar, 500);

    // Apply CSS after 2 minutes
    const applyCSSAfterDelay = () => {
      const style = document.createElement('style');
      style.innerHTML = `
        body > .skiptranslate {
          display: none;
        }
        body .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-menu-frame {
          display: none !important;
        }
        .goog-logo-link {
          display: none !important;
        }
        .goog-te-gadget {
          font-size: 0px !important;
        }
      `;
      document.head.appendChild(style);
    };
    
    // Trigger the CSS after 2 minutes (120,000 milliseconds)
    setTimeout(applyCSSAfterDelay, 30000);

  }, []);

  return (
    <div className="translate-container flex justify-center my-4 p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-primaryColor mb-2">Choose Language</h2>
      <div 
        id="google_translate_element" 
        className="bg-white px-4 py-2 rounded-lg border border-gray-200"
      ></div>
    </div>
  );
}
