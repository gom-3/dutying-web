import type React from 'react';
import {useTranslation} from 'react-i18next';
import {type ko} from '../locales/ko';

type TJoin<K, P> = K extends string | number ? (P extends string | number ? `${K}.${P}` : never) : never;

type TPaths<T> = T extends string
    ? never
    : {
          [K in Extract<keyof T, string | number>]: T[K] extends string
              ? `${K & (string | number)}`
              : T[K] extends Record<string, unknown>
                ? TJoin<K & (string | number), TPaths<T[K]>>
                : never;
      }[Extract<keyof T, string | number>];

export type TI18nKey = TPaths<typeof ko> & string;

type TValueType = string | number | React.JSX.Element;

export function useTypedTranslation() {
    const {t} = useTranslation();

    function typedT<K extends TI18nKey>(key: K, values?: Record<string, TValueType>): string {
        return t(key, values) as string;
    }

    return {t: typedT};
}
