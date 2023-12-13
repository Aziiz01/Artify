import React from 'react';
import './privacy.css'; // Import your CSS file for styling

const PrivacyPage: React.FC = () => {
    return (
        <div className="privacy-container">
            <h1 className="privacy-title">Privacy Policy</h1>

            <p className="last-updated">Last updated: 10 December 2023</p>

            <h2>1. Introduction</h2>
            <p>Welcome to Imaginify, a platform specializing in AI image generation, upscaling, and enhancement. This Privacy Policy outlines how we collect, utilize, disclose, and secure your information when you engage with our website.</p>

            <h2>2. Information We Collect</h2>
            <>Personal information refers to details or opinions about an individual, whether recorded or not, that can identify them. The types of personal information we may collect include:
                
                The types of personal information we may collect about you include:
                
                <ul>
    <li><strong>Identity Data:</strong> First name and last name.</li>
    <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
    <li><strong>Financial Data:</strong> Bank account and payment card details (through third-party payment processors such as Stripe).</li>
    <li><strong>Transaction Data:</strong> Details about payments to you from us and from you to us, and other details of products and services you have purchased from us or we have purchased from you.</li>
    <li><strong>Technical and Usage Data:</strong> Internet protocol (IP) address, your login data, your browser session and geo-location data, device and network information, statistics on page views and sessions, acquisition sources, search queries, and/or browsing behavior, information about your access and use of our website, including through the use of Internet cookies, your communications with our website, the type of browser you are using, the type of operating system you are using, and the domain name of your Internet service provider.</li>
    <li><strong>Profile Data:</strong> Your username and password (including for NightCafe Lounge, our Discord forum), profile picture, purchases or orders you have made with us, designs you have created with us (prior to you deleting them), support requests you have made, content you post, send receive and share through our platform, information you have shared with our social media platforms, your interests, preferences, feedback, and survey responses.</li>
    <li><strong>Interaction Data:</strong> Information you provide to us when you participate in any interactive features of our Services, including surveys, contests, promotions, activities, or events.</li>
    <li><strong>Marketing and Communications Data:</strong> Your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
    <li><strong>Professional Data:</strong> Where you are a worker of ours or applying for a role with us, your professional history such as your previous positions and professional experience.</li>
    <li><strong>Sensitive Information:</strong> Sensitive information is a sub-set of personal information that is given a higher level of protection. Sensitive information means information relating to your racial or ethnic origin, political opinions, religion, trade union or other professional associations or memberships, philosophical beliefs, sexual orientation or practices, criminal records, health information or biometric information. We do not actively collect any Sensitive Information about you, and unless otherwise permitted by law, we will not collect sensitive information about you without first obtaining your consent.</li>
</ul>
                      
                            </>
            <h2>3. How We Collect Your Information</h2>
            <p>We collect personal information in various ways:</p>
            <ul>
                <li>Directly: You provide personal information when registering, using the Feedback and Support form, or requesting assistance.</li>
                <li>Indirectly: Personal information may be collected during interactions on our website, via email, telephone, or other forums.</li>
                <li>From third parties: We collect information from authentication providers (Clerk : <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#001F3F' }}>View Clerk privacy policy here</a>), analytics, cookie providers, and marketing providers.</li>
            </ul>

            <h2>4. How We Use Your Information</h2>
            <table className='privacy-table'>
                <thead>
                    <tr>
                        <th>Purpose of Use / Disclosure</th>
                        <th>Type of Personal Information</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>To provide our Services to you, including to dispatch and deliver our products to you.</td>
                        <td>
                            Identity Data<br />
                            Contact Data<br />
                            Profile Data<br />
                            Interaction Data
                        </td>
                    </tr>
                    <tr>
                        <td>To contact and communicate with you about our Services, including in response to any support requests you lodge with us or other enquiries you make with us.</td>
                        <td>
                            Identity Data<br />
                            Contact Data<br />
                            Profile Data
                        </td>
                    </tr>
                        <tr> 
                        <td>To contact and communicate with you about our Services, including in response to any support requests you lodge with us or other enquiries you make with us.</td>
                        <td>
                            Identity Data<br />
                            Contact Data<br />
                        </td>
                        </tr>
                        <tr>
                            <td>For analytics including profiling on our website, market research and business development, including to operate and improve our Services, associated applications and associated social media platforms.</td>
                        <td>Technical and usage Data
                          </td>
                        </tr>
                        <tr>
                            <td>For advertising and marketing, including to send you promotional information about our products and experiences and information that we consider may be of interest to you.</td>
                     <td>       Identity Data
                                Contact Data
                                Profile Data
                                Interaction Data
                                Marketing and communications Data</td>
                        </tr>
                        <tr>
                            <td>To run promotions, competitions and/or offer additional benefits to you.</td>
                            <td>Identity Data
                                Contact Data
                                Profile Data
                                Interaction Data
                                Marketing and communications Data</td>
                        </tr>
                        <tr>
                            <td>To comply with our legal obligations or if otherwise required or authorised by law.</td>
                        </tr>
                </tbody>
            </table>

            <h2>5. Data Security</h2>
            <p>
                We are dedicated to securing the personal information we collect. Appropriate physical, electronic, and managerial procedures are in place to prevent unauthorized access, disclosure, and safeguard against misuse, interference, loss, and unauthorized access.
                While we are committed to security, we cannot guarantee the security of information transmitted over the Internet; transmission and exchange of information are at your own risk.
            </p>

            <h2>6. Amendments</h2>
            <p>We may, at any time and at our discretion, update this Privacy Policy. Check our website regularly to stay informed about our current Privacy Policy.</p>

            <h2>7. Use of Google API Services</h2>
            <p>
                Our use of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#001F3F' }}>
        Google API Services User Data Policy
    </a>, including Limited Use requirements. We only use personal information for providing or improving our Services and do not use it for ads.
                These restrictions apply to raw data and aggregated, anonymized, or derived data. We have policies in place to safeguard personal information obtained through Google APIs.
            </p>

            <h2>8. Contact Us</h2>
            <p>If you have questions or concerns about our Privacy Policy, contact us at:</p>
            <address>
                Imaginify Studio Pty Ltd (ABN 76 654 351 701)<br />
                Email: [insert email]<br />
                Last update: 10 December 2023
            </address>
        </div>
    );
};

export default PrivacyPage;
