# Manual Upload Instructions for Super-Deploy Agent Landing Page

## 1. Accessing cPanel File Manager

1. Open your web browser and go to https://formatdisc.hr:2083/
2. Enter your cPanel username (`formatdisc`) and password (`Formatdisc123!`)
3. Click "Log in"
4. In the cPanel dashboard, find and click on "File Manager"
5. This will open the File Manager interface

## 2. Uploading Files

### Option 1: Upload and Extract Zip File
1. In the File Manager, navigate to the `public_html` directory (this is your website's root folder)
2. Click on the "Upload" button in the top menu
3. In the upload interface, click "Choose File" and select the `super-deploy-agent.zip` file we created
4. After the upload completes, return to the file listing
5. Right-click on the `super-deploy-agent.zip` file and select "Extract"
6. In the extraction dialog, make sure the extraction path is set to `/public_html`
7. Click "Extract File(s)" to complete the extraction

### Option 2: Upload Individual Files
1. In the File Manager, navigate to the `public_html` directory
2. Click on the "Upload" button in the top menu
3. In the upload interface, click "Choose File" and select the `index.html` file
4. After the upload completes, repeat the process for the `contact.php` file

## 3. Setting File Permissions

1. In the File Manager, select both `index.html` and `contact.php` files
2. Right-click and select "Change Permissions"
3. Set the permissions to 644 (Owner: read/write, Group: read, World: read)
4. Click "Change Permissions" to apply

## 4. Configuring Email Settings

The contact form is already configured to send emails to `info@formatdisc.hr`. If you want to change this:

1. In the File Manager, right-click on `contact.php` and select "Edit"
2. Find the line that says `$to = "info@formatdisc.hr";` and change the email address if needed
3. Click "Save Changes" when done

## 5. Testing the Website

1. Open a new browser tab and navigate to https://formatdisc.hr/
2. Verify that the Super-Deploy Agent landing page loads correctly
3. Test all interactive elements:
   - Navigation menu (especially on mobile)
   - FAQ accordion sections
   - Animated statistics
   - Contact form

## 6. Testing the Contact Form

1. Fill out the contact form with test information
2. Submit the form
3. Check that you receive the email at the configured address
4. If the form doesn't work, check the following:
   - File permissions on contact.php (should be 644)
   - Email configuration in cPanel (Email Accounts section)
   - PHP configuration (PHP Version should be 7.0 or higher)

## 7. Mobile Testing

1. Open the website on a mobile device or use your browser's mobile emulation mode
2. Test the responsive design at various screen sizes
3. Verify that the mobile menu works correctly
4. Test all interactive elements on mobile

## 8. Final Verification

1. Confirm that the website is accessible at https://formatdisc.hr/
2. Verify that all content is displayed correctly
3. Check that all links work properly
4. Ensure that the contact form is functioning correctly

If you encounter any issues during this process, please let me know and I'll provide further assistance.