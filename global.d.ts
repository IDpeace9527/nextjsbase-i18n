import en from './messages/en.json';

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {
    [namespace: string]: Record<string, string>;
    LocaleLayout: {
      title: string;
      description: string;
      keywords: string;
    };
  }
}
