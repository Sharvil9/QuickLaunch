import { openUrlInBackground } from './openUrl';

// Function to check if an app is installed by testing protocol handler
export async function isAppInstalled(protocol: string): Promise<boolean> {
  try {
    // Create a hidden iframe to test the protocol
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Try to open the protocol
    iframe.src = protocol;

    // Return true if no error occurs
    return true;
  } catch {
    return false;
  }
}

// Function to open an application
export function openApplication(link: { url: string; isApp?: boolean; appProtocol?: string; appPath?: string }) {
  // Check browser type for protocol handler support
  const isFirefox = navigator.userAgent.includes('Firefox');

  if (link.isApp && link.appProtocol) {
    if (isFirefox) {
      // Firefox requires different handling for protocol URLs
      try {
        window.location.href = link.appProtocol;
      } catch {
        openUrlInBackground(link.url);
      }
    } else {
      // Chrome, Edge, and Arc can handle protocol URLs directly
      window.location.href = link.appProtocol;
    }
  } else if (link.isApp && link.appPath) {
    // Try to open using direct path (if supported by browser/OS)
    window.open(link.appPath);
  } else {
    // Fallback to web URL
    openUrlInBackground(link.url);
  }
}
