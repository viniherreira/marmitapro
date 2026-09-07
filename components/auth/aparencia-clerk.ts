import type { ComponentProps } from "react";
import type { ClerkProvider } from "@clerk/nextjs";

/** O tipo vem do próprio provider, sem depender de @clerk/types. */
type Appearance = NonNullable<
  ComponentProps<typeof ClerkProvider>["appearance"]
>;

/**
 * As telas do Clerk usam as mesmas classes do resto do produto, então o tema
 * escuro e os tokens de marca valem lá dentro sem duplicar paleta.
 */
export const aparenciaClerk: Appearance = {
  variables: {
    borderRadius: "0.75rem",
    fontFamily: "var(--font-body)",
    fontSize: "0.9375rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none border-0",
    card: "bg-transparent shadow-none p-0 gap-6",
    header: "text-left gap-2",
    headerTitle: "t-h1 text-foreground",
    headerSubtitle: "t-body text-muted",
    dividerRow: "my-6",
    dividerLine: "bg-border",
    dividerText: "t-small text-muted",
    socialButtons: "gap-2",
    socialButtonsBlockButton:
      "h-10 rounded-lg border border-border bg-surface text-foreground text-[0.9375rem] font-medium hover:bg-surface-hover transition-colors duration-150",
    socialButtonsBlockButtonText: "text-foreground font-medium",
    formFieldLabel: "text-[0.8125rem] font-medium text-foreground",
    formFieldInput:
      "h-10 rounded-lg border border-border bg-surface px-3 text-[0.9375rem] text-foreground placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none transition-colors duration-150",
    formFieldInputShowPasswordButton: "text-muted hover:text-foreground",
    formButtonPrimary:
      "h-10 rounded-lg bg-primary text-primary-foreground text-[0.9375rem] font-medium normal-case tracking-normal shadow-none hover:bg-primary-hover transition-colors duration-150 after:hidden",
    formFieldAction: "text-[0.8125rem] text-primary hover:underline",
    footer: "bg-transparent",
    footerAction: "bg-transparent",
    footerActionText: "t-small text-muted",
    footerActionLink: "text-primary font-medium hover:underline",
    identityPreview: "rounded-lg border border-border bg-surface",
    identityPreviewText: "text-foreground",
    identityPreviewEditButton: "text-primary",
    formResendCodeLink: "text-primary",
    otpCodeFieldInput:
      "rounded-lg border border-border bg-surface text-foreground focus:border-primary",
    alert: "rounded-lg border border-destructive/25 bg-destructive-soft",
    alertText: "text-foreground text-[0.875rem]",
    formFieldErrorText: "text-[0.8125rem] text-destructive",
    formFieldSuccessText: "text-[0.8125rem] text-success",
    formFieldWarningText: "text-[0.8125rem] text-warning",
    userButtonPopoverCard:
      "rounded-xl border border-border bg-surface shadow-pop",
    userButtonPopoverActionButton:
      "text-foreground hover:bg-surface-hover rounded-lg",
    userButtonPopoverActionButtonText: "text-foreground",
    userButtonPopoverFooter: "hidden",
    avatarBox: "size-8 rounded-full",
  },
};
