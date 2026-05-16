import { Helmet } from "react-helmet-async";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Terms and Conditions | Rise to Rice</title>
        <meta name="description" content="Read the Terms and Conditions of Rise to Rice." />
      </Helmet>
      
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Terms and Conditions</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
            <p>
              Welcome to Rise to Rice. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. User Accounts</h2>
            <p>
              To access certain features of the platform, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Use of Services</h2>
            <p>
              You agree to use Rise to Rice only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Intellectual Property</h2>
            <p>
              All content on Rise to Rice, including text, graphics, logos, and software, is the property of Rise to Rice or its content suppliers and is protected by international copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Limitation of Liability</h2>
            <p>
              Rise to Rice shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the platform following any changes constitutes your acceptance of the new Terms and Conditions.
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
