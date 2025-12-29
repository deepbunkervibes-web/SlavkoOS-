# Manual Upload Instructions for Super-Deploy Agent Redesigned Landing Page

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
3. In the upload interface, click "Choose File" and select the `super-deploy-agent-redesign.zip` file we created
4. After the upload completes, return to the file listing
5. Right-click on the `super-deploy-agent-redesign.zip` file and select "Extract"
6. In the extraction dialog, make sure the extraction path is set to `/public_html`
7. Click "Extract File(s)" to complete the extraction
8. Rename `index-redesign.html` to `index.html` and `contact-redesign.php` to `contact.php`

### Option 2: Upload Individual Files
1. In the File Manager, navigate to the `public_html` directory
2. Click on the "Upload" button in the top menu
3. In the upload interface, click "Choose File" and select the `index-redesign.html` file
4. After the upload completes, repeat the process for the `contact-redesign.php` file
5. Rename `index-redesign.html` to `index.html` and `contact-redesign.php` to `contact.php`

## 3. Setting File Permissions

1. In the File Manager, select both `index.html` and `contact.php` files
2. Right-click and select "Change Permissions"
3. Set the permissions to 644 (Owner: read/write, Group: read, World: read)
4. Click "Change Permissions" to apply

## 4. Animation Performance Optimization

The redesigned landing page includes several animations that enhance the user experience. To ensure optimal performance:

1. **Browser Compatibility**: The animations use modern CSS and JavaScript techniques that work best in recent versions of Chrome, Firefox, Safari, and Edge.

2. **Mobile Performance**: 
   - The animations are designed to be lightweight and performant on mobile devices
   - If you notice any performance issues on older mobile devices, you can modify the JavaScript to disable certain animations on smaller screens

3. **Intersection Observer**: 
   - The page uses the Intersection Observer API to trigger animations when elements come into view
   - This improves performance by only animating elements when they're visible
   - No action is required, but it's good to be aware of this technique

4. **Animation Timing**:
   - The animations are staggered to create a smooth, flowing experience
   - If animations feel too slow or too fast, you can adjust the timing in the JavaScript section at the bottom of the index.html file

## 5. Testing the Website

1. Open a new browser tab and navigate to https://formatdisc.hr/
2. Verify that the Super-Deploy Agent landing page loads correctly with all animations
3. Test all interactive elements:
   - Navigation menu (especially on mobile)
   - FAQ accordion sections
   - Animated statistics (should count up when scrolled into view)
   - Scroll animations (elements should fade in as you scroll down)
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
4. Test all interactive elements and animations on mobile

## 8. Final Verification

1. Confirm that the website is accessible at https://formatdisc.hr/
2. Verify that all content is displayed correctly
3. Check that all animations work smoothly
4. Ensure that the contact form is functioning correctly

If you encounter any issues during this process, please let me know and I'll provide further assistance.