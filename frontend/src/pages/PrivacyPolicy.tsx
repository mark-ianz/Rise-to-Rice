import { Helmet } from "react-helmet";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Privacy Policy | Rise to Rice</title>
        <meta name="description" content="Read the Privacy Policy of Rise to Rice." />
      </Helmet>
      
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, update your profile, or use our services. This may include your name, email address, password, and contact information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect Rise to Rice and our users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Sharing of Information</h2>
            <p>
              We do not share your personal information with third parties except as described in this Privacy Policy, such as with your consent or for legal reasons.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Your Choices</h2>
            <p>
              You may update or correct your account information at any time by logging into your account. You may also contact us if you wish to delete your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Cookies</h2>
            <p>
              We use cookies and similar technologies to provide and support our services and each of the uses outlined and described in this policy.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t text-sm text-gray-400">
            Last updated: May 15, 2026
          </div>
        </div>
      </div>
    </div>
  );
}
