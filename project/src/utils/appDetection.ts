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
  } catch (error) {
    return false;
  }
}

// Function to open an application
export function openApplication(link: { url: string; isApp?: boolean; appProtocol?: string; appPath?: string }) {
  if (link.isApp && link.appProtocol) {
    // Try to open using protocol handler
    window.location.href = link.appProtocol;
  } else if (link.isApp && link.appPath) {
    // Try to open using direct path (if supported by browser/OS)
    window.open(link.appPath);
  } else {
    // Fallback to web URL
    window.open(link.url, '_blank');
  }
}