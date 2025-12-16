import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface LoginEmailProps {
  magicLink: string;
  email?: string;
  token?: string;
}

export const LoginEmail = ({
  magicLink = "https://example.com/verify",
  email = "user@example.com",
  token,
}: LoginEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Your magic link to sign in - Click to access your account
      </Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto py-12 px-4 max-w-2xl">
            {/* Main Card */}
            <Section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header Section */}
              <Section className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8 border-b border-slate-200">
                <Heading className="text-2xl font-semibold text-slate-900 m-0 mb-2">
                  Sign in to your account 🔐
                </Heading>
                <Text className="text-sm text-slate-600 m-0">
                  Click the button below to securely access your account
                </Text>
              </Section>

              {/* Content Section */}
              <Section className="px-6 py-6">
                <Text className="text-base text-slate-700 leading-relaxed mt-0 mb-4">
                  We received a request to sign in to your account using this
                  email address: <strong>{email}</strong>
                </Text>

                {token ? (
                  <>
                    <Text className="text-base text-slate-700 leading-relaxed my-4">
                      Use this verification code to sign in:
                    </Text>

                    {/* Token Display */}
                    <Section className="text-center my-6">
                      <div className="inline-block bg-slate-100 border-2 border-slate-300 rounded-lg px-8 py-6">
                        <Text className="text-3xl font-bold text-slate-900 tracking-widest m-0 font-mono">
                          {token}
                        </Text>
                      </div>
                    </Section>

                    <Text className="text-sm text-slate-600 text-center my-4">
                      This code will expire in <strong>15 minutes</strong> for
                      security reasons.
                    </Text>

                    <Section className="border-t border-slate-200 pt-6 mt-6">
                      <Text className="text-base text-slate-700 text-center mb-4">
                        Or click the button below to sign in automatically:
                      </Text>

                      {/* CTA Button */}
                      <Section className="text-center my-6">
                        <Button
                          href={magicLink}
                          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-8 py-3 text-sm font-medium text-white no-underline hover:bg-slate-800 transition-all shadow-sm"
                        >
                          Sign in to your account
                        </Button>
                      </Section>
                    </Section>
                  </>
                ) : (
                  <>
                    <Text className="text-base text-slate-700 leading-relaxed my-4">
                      Click the button below to sign in. This link will expire
                      in <strong>15 minutes</strong> for security reasons.
                    </Text>

                    {/* CTA Button */}
                    <Section className="text-center my-8">
                      <Button
                        href={magicLink}
                        className="inline-flex items-center justify-center rounded-md bg-slate-900 px-8 py-4 text-base font-medium text-white no-underline hover:bg-slate-800 transition-all shadow-sm"
                      >
                        Sign in to your account
                      </Button>
                    </Section>
                  </>
                )}

                {/* Alternative Link */}
                <Text className="text-xs text-slate-500 text-center my-4">
                  Or copy and paste this URL into your browser:
                  <br />
                  <Link
                    href={magicLink}
                    className="text-slate-700 underline break-all"
                  >
                    {magicLink}
                  </Link>
                </Text>
              </Section>

              {/* Security Warning Section */}
              <Section className="bg-amber-50 border-l-4 border-amber-400 px-6 py-4 mx-6 my-4 rounded">
                <Text className="text-sm text-amber-900 m-0 mb-2">
                  <strong>Security Notice</strong>
                </Text>
                <Text className="text-sm text-amber-800 m-0">
                  If you didn't request this sign-in link, you can safely ignore
                  this email. The link will expire automatically.
                </Text>
              </Section>

              {/* Help Section */}
              <Section className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                <Text className="text-sm text-slate-600 m-0 mb-2">
                  <strong>Having trouble signing in?</strong>
                </Text>
                <Text className="text-sm text-slate-600 m-0">
                  Make sure you're using the latest link sent to your email. If
                  you continue to have issues, please{" "}
                  <Link
                    href="mailto:support@example.com"
                    className="text-slate-900 underline"
                  >
                    contact our support team
                  </Link>
                  .
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="mt-8 text-center">
              <Text className="text-xs text-slate-500 m-0 mb-2">
                This email was sent because a sign-in was requested for your
                account.
              </Text>
              <Text className="text-xs text-slate-500 m-0">
                © {new Date().getFullYear()} Auth Server. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default LoginEmail;
