import {fireEvent} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen} from '@/shared/util/test-utils';
import {ProfileImage} from '..';

vi.mock('@/shared/config/runtime', () => ({
    RUNTIME_CONFIG: {
        profileImageBaseUrl: () => 'https://cdn.example.com',
    },
}));

describe('ProfileImage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('업로드 이미지가 실패하면 기본 프로필 이미지로 fallback 한다', () => {
        render(
            <ProfileImage
                name="홍길동"
                className="h-10 w-10"
                profileImg={{
                    profileImgUrl: 'https://cdn.example.com/custom/profile.png',
                    defaultProfileImgId: 2,
                }}
            />,
        );

        const image = screen.getByRole('img', {name: '홍길동 프로필 이미지'});

        expect(image).toHaveAttribute('src', 'https://cdn.example.com/custom/profile.png');

        fireEvent.error(image);

        expect(screen.getByRole('img', {name: '홍길동 프로필 이미지'})).toHaveAttribute(
            'src',
            'https://cdn.example.com/profile_img/default/profile2.png',
        );
    });

    it('모든 이미지 소스가 실패하면 이니셜 placeholder를 보여준다', () => {
        render(
            <ProfileImage
                name="홍길동"
                className="h-10 w-10"
                profileImg={{
                    profileImgUrl: 'https://cdn.example.com/custom/profile.png',
                }}
            />,
        );

        fireEvent.error(screen.getByRole('img', {name: '홍길동 프로필 이미지'}));
        fireEvent.error(screen.getByRole('img', {name: '홍길동 프로필 이미지'}));

        const fallback = screen.getByRole('img', {name: '홍길동 프로필 이미지'});

        expect(fallback.tagName).toBe('DIV');
        expect(fallback).toHaveTextContent('홍');
    });
});
