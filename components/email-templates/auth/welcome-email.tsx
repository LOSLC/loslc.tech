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

interface WelcomeEmailProps {
  name: string;
  dashboardLink: string;
}

export const WelcomeEmail = ({
  name = "User",
  dashboardLink = "https://example.com/dashboard",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform! Get started with your account.</Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto py-12 px-4 max-w-2xl">
            {/* Main Card */}
            <Section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header Section */}
              <Section className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-8 border-b border-slate-200">
                <Heading className="text-2xl font-semibold text-slate-900 m-0 mb-2">
                  Welcome, {name}!
                </Heading>
                <Text className="text-sm text-slate-600 m-0">
                  We're excited to have you on board
                </Text>
              </Section>

              {/* Content Section */}
              <Section className="px-6 py-6">
                <Text className="text-base text-slate-700 leading-relaxed mt-0 mb-4">
                  Thank you for creating an account! Your account has been
                  successfully set up and you're ready to get started.
                </Text>

                <Text className="text-base text-slate-700 leading-relaxed my-4">
                  Here's what you can do next:
                </Text>

                {/* Feature List */}
                <Section className="my-6">
                  <table className="w-full">
                    <tr>
                      <td className="pb-3">
                        <Text className="m-0 text-sm text-slate-700">
                          <span className="inline-block w-6 h-6 rounded-full bg-primary/10 text-primary text-center leading-6 mr-2 font-semibold">
                            ✓
                          </span>
                          Access your personalized dashboard
                        </Text>
                      </td>
                    </tr>
                    <tr>
                      <td className="pb-3">
                        <Text className="m-0 text-sm text-slate-700">
                          <span className="inline-block w-6 h-6 rounded-full bg-primary/10 text-primary text-center leading-6 mr-2 font-semibold">
                            ✓
                          </span>
                          Complete your profile settings
                        </Text>
                      </td>
                    </tr>
                    <tr>
                      <td className="pb-3">
                        <Text className="m-0 text-sm text-slate-700">
                          <span className="inline-block w-6 h-6 rounded-full bg-primary/10 text-primary text-center leading-6 mr-2 font-semibold">
                            ✓
                          </span>
                          Explore all available features
                        </Text>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Text className="m-0 text-sm text-slate-700">
                          <span className="inline-block w-6 h-6 rounded-full bg-primary/10 text-primary text-center leading-6 mr-2 font-semibold">
                            ✓
                          </span>
                          Connect with our community
                        </Text>
                      </td>
                    </tr>
                  </table>
                </Section>

                <Text className="text-base text-slate-700 leading-relaxed my-4">
                  Click the button below to access your dashboard and start
                  exploring:
                </Text>

                {/* CTA Button */}
                <Section className="text-center my-8">
                  <Button
                    href={dashboardLink}
                    className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white no-underline hover:bg-slate-800 transition-all shadow-sm"
                  >
                    Go to Dashboard
                  </Button>
                </Section>

                {/* Alternative Link */}
                <Text className="text-xs text-slate-500 text-center my-4">
                  Or copy and paste this URL into your browser:
                  <br />
                  <Link
                    href={dashboardLink}
                    className="text-slate-700 underline break-all"
                  >
                    {dashboardLink}
                  </Link>
                </Text>
              </Section>

              {/* Help Section */}
              <Section className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                <Text className="text-sm text-slate-600 m-0 mb-2">
                  <strong>Need help getting started?</strong>
                </Text>
                <Text className="text-sm text-slate-600 m-0">
                  If you have any questions or need assistance, feel free to{" "}
                  <Link
                    href="mailto:support@example.com"
                    className="text-slate-900 underline"
                  >
                    contact our support team
                  </Link>
                  . We're here to help!
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="mt-8 text-center">
              <Text className="text-xs text-slate-500 m-0 mb-2">
                This email was sent to you because you created an account.
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

export default WelcomeEmail;
