import {cn} from '@dutying/utils/style';
import {Eye, EyeOff, Loader2, Lock, Mail} from 'lucide-react';
import {type FormEvent, useState} from 'react';
import {Carousel} from 'react-responsive-carousel';
import {Link, useLocation, useNavigate} from 'react-router';
import useAuth from '@/features/auth';
import {getIsDemoSignupLoginReason} from '@/features/auth/model/demo-session';
import {buildSocialSignupRegisterPath} from '@/features/auth/model/social-signup';
import {AuthAPI} from '@/shared/api';
import {AppleIcon, BackCircle, KakaoIcon, NextCircle} from '@/shared/assets/svg';
import {buildAuthAuthorizeUrl, RUNTIME_CONFIG, sanitizeInternalPath} from '@/shared/config/runtime';
import ROUTE from '@/shared/constant/path';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './index.css';

type TSignupErrors = Partial<Record<'name' | 'email' | 'password' | 'passwordConfirm', string>>;
type TPasswordResetErrors = Partial<Record<'email' | 'resetToken' | 'newPassword' | 'newPasswordConfirm', string>>;

const FIELD_CLASS =
    'h-11 w-full rounded-[12px] border border-transparent bg-gray-7 px-3.5 text-[15px] font-medium text-sub-1 outline-none transition-colors placeholder:text-gray-4 focus-visible:bg-main-light';
const PASSWORD_MIN_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RESET_MODE = 'password-reset';
const getInputClassName = (hasError: boolean) => cn(FIELD_CLASS, hasError && 'border-red bg-[#FFF7F8] focus-visible:bg-white');
const PasswordVisibilityButton = ({visible, onClick}: {visible: boolean; onClick: () => void}) => (
    <button
        type="button"
        className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-4 transition-colors hover:bg-gray-6 hover:text-sub-1"
        onClick={onClick}
        aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
        title={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
    >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
);
const FieldError = ({id, message}: {id: string; message?: string}) =>
    message ? (
        <p id={id} className="mt-1 text-xs text-red">
            {message}
        </p>
    ) : null;

function LoginPage() {
    const navigate = useNavigate();
    const {pathname, search} = useLocation();
    const {
        actions: {handleDevSignupBypass, handleLogin},
    } = useAuth();
    const params = new URLSearchParams(search);
    const nextPath = sanitizeInternalPath(params.get('next'), ROUTE.MAKE);
    const isDemoSignupFlow = getIsDemoSignupLoginReason(search);
    const isSignupPage = pathname === ROUTE.SIGN_UP;
    const isPasswordResetPage = !isSignupPage && params.get('mode') === PASSWORD_RESET_MODE;
    const canUseDevSignupBypass = import.meta.env.DEV && isSignupPage;
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupEmailVerificationToken, setSignupEmailVerificationToken] = useState<string | null>(null);
    const [signupPassword, setSignupPassword] = useState('');
    const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [signupErrors, setSignupErrors] = useState<TSignupErrors>({});
    const [signupError, setSignupError] = useState<string | null>(null);
    const [signupVerificationMessage, setSignupVerificationMessage] = useState<string | null>(null);
    const [signupVerificationError, setSignupVerificationError] = useState<string | null>(null);
    const [signupVerificationCode, setSignupVerificationCode] = useState('');
    const [hasRequestedSignupVerification, setHasRequestedSignupVerification] = useState(false);
    const [passwordResetEmail, setPasswordResetEmail] = useState('');
    const [passwordResetToken, setPasswordResetToken] = useState('');
    const [passwordResetNewPassword, setPasswordResetNewPassword] = useState('');
    const [passwordResetNewPasswordConfirm, setPasswordResetNewPasswordConfirm] = useState('');
    const [passwordResetErrors, setPasswordResetErrors] = useState<TPasswordResetErrors>({});
    const [passwordResetMessage, setPasswordResetMessage] = useState<string | null>(null);
    const [passwordResetError, setPasswordResetError] = useState<string | null>(null);
    const [hasRequestedPasswordReset, setHasRequestedPasswordReset] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSendingVerification, setIsSendingVerification] = useState(false);
    const [isRequestingPasswordReset, setIsRequestingPasswordReset] = useState(false);
    const isSignupEmailValid = EMAIL_PATTERN.test(signupEmail.trim());
    const isSignupEmailVerified = Boolean(signupEmailVerificationToken);
    const isPasswordResetEmailValid = EMAIL_PATTERN.test(passwordResetEmail.trim());
    const isLoginDisabled = !loginEmail.trim() || !loginPassword || isSubmitting;
    const isSignupBusy = isSubmitting || isSendingVerification;
    const isSignupDisabled = !signupName.trim() || !isSignupEmailVerified || !signupPassword || !signupPasswordConfirm || isSignupBusy;
    const isPasswordResetBusy = isSubmitting || isRequestingPasswordReset;
    const isPasswordResetSubmitDisabled =
        !hasRequestedPasswordReset ||
        !isPasswordResetEmailValid ||
        !passwordResetToken.trim() ||
        !passwordResetNewPassword ||
        !passwordResetNewPasswordConfirm ||
        isPasswordResetBusy;
    const socialAuthorizeNextPath = isSignupPage ? buildSocialSignupRegisterPath() : nextPath;
    const kakaoAuthorizeUrl = buildAuthAuthorizeUrl('kakao', socialAuthorizeNextPath);
    const appleAuthorizeUrl = buildAuthAuthorizeUrl('apple', socialAuthorizeNextPath);
    const title = isSignupPage ? '회원가입' : isPasswordResetPage ? '비밀번호 재설정' : '로그인';
    const validateSignup = () => {
        const nextErrors: TSignupErrors = {};

        if (!signupName.trim()) {
            nextErrors.name = '이름을 입력해 주세요.';
        }

        if (!EMAIL_PATTERN.test(signupEmail.trim())) {
            nextErrors.email = '올바른 이메일 주소를 입력해 주세요.';
        }

        if (signupPassword.length < PASSWORD_MIN_LENGTH) {
            nextErrors.password = `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.`;
        }

        if (signupPassword !== signupPasswordConfirm) {
            nextErrors.passwordConfirm = '비밀번호가 서로 달라요.';
        }

        setSignupErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };
    const handleSignupEmailChange = (value: string) => {
        setSignupEmail(value);
        setSignupEmailVerificationToken(null);
        setSignupVerificationCode('');
        setHasRequestedSignupVerification(false);
        setSignupVerificationMessage(null);
        setSignupVerificationError(null);
    };
    const handleSignupVerificationCodeChange = (value: string) => {
        setSignupVerificationCode(value);
        setSignupEmailVerificationToken(value.trim() ? value.trim() : null);
    };
    const handlePasswordResetEmailChange = (value: string) => {
        setPasswordResetEmail(value);
        setPasswordResetToken('');
        setPasswordResetNewPassword('');
        setPasswordResetNewPasswordConfirm('');
        setPasswordResetErrors({});
        setPasswordResetMessage(null);
        setPasswordResetError(null);
        setHasRequestedPasswordReset(false);
    };
    const validatePasswordReset = () => {
        const nextErrors: TPasswordResetErrors = {};

        if (!EMAIL_PATTERN.test(passwordResetEmail.trim())) {
            nextErrors.email = '올바른 이메일 주소를 입력해 주세요.';
        }

        if (!hasRequestedPasswordReset) {
            nextErrors.resetToken = '먼저 재설정 메일을 요청해 주세요.';
        } else if (!passwordResetToken.trim()) {
            nextErrors.resetToken = '메일로 받은 재설정 코드를 입력해 주세요.';
        }

        if (passwordResetNewPassword.length < PASSWORD_MIN_LENGTH) {
            nextErrors.newPassword = `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.`;
        }

        if (passwordResetNewPassword !== passwordResetNewPasswordConfirm) {
            nextErrors.newPasswordConfirm = '비밀번호가 서로 달라요.';
        }

        setPasswordResetErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };
    const handleSendSignupEmailVerification = async () => {
        setHasRequestedSignupVerification(true);
        setSignupVerificationMessage(null);
        setSignupVerificationError(null);
        setSignupEmailVerificationToken(null);
        setSignupVerificationCode('');

        if (!isSignupEmailValid) {
            setSignupErrors((errors) => ({...errors, email: '올바른 이메일 주소를 입력해 주세요.'}));

            return;
        }

        setSignupErrors((errors) => ({...errors, email: undefined}));
        setIsSendingVerification(true);

        try {
            const response = await AuthAPI.sendAdminEmailVerification({email: signupEmail.trim()});

            if (response.debugVerificationToken) {
                setSignupEmailVerificationToken(response.debugVerificationToken);
                setSignupVerificationCode(response.debugVerificationToken);
                setSignupVerificationMessage('이메일 인증이 완료됐어요.');

                return;
            }

            setSignupVerificationMessage('인증 메일을 보냈어요. 메일함에서 인증번호를 확인해 주세요.');
        } catch (error) {
            setSignupVerificationError(error instanceof Error ? error.message : '인증 메일을 보내지 못했어요. 다시 시도해 주세요.');
        } finally {
            setIsSendingVerification(false);
        }
    };
    const handleRequestPasswordReset = async () => {
        setPasswordResetMessage(null);
        setPasswordResetError(null);
        setPasswordResetToken('');
        setPasswordResetNewPassword('');
        setPasswordResetNewPasswordConfirm('');

        if (!isPasswordResetEmailValid) {
            setPasswordResetErrors((errors) => ({...errors, email: '올바른 이메일 주소를 입력해 주세요.'}));

            return;
        }

        setPasswordResetErrors({});
        setIsRequestingPasswordReset(true);

        try {
            const response = await AuthAPI.requestAdminPasswordReset({email: passwordResetEmail.trim()});

            setHasRequestedPasswordReset(true);

            if (response.debugResetToken) {
                setPasswordResetToken(response.debugResetToken);
                setPasswordResetMessage('재설정 코드가 확인됐어요. 새 비밀번호를 입력해 주세요.');

                return;
            }

            setPasswordResetMessage('재설정 메일을 보냈어요. 메일함에서 재설정 코드를 확인해 주세요.');
        } catch (error) {
            setPasswordResetError(error instanceof Error ? error.message : '재설정 메일을 보내지 못했어요. 다시 시도해 주세요.');
        } finally {
            setIsRequestingPasswordReset(false);
        }
    };
    const handlePasswordLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginError(null);

        if (!loginEmail.trim() || !loginPassword) {
            setLoginError('이메일과 비밀번호를 입력해 주세요.');

            return;
        }

        setIsSubmitting(true);

        try {
            const response = await AuthAPI.passwordLogin({
                email: loginEmail.trim(),
                password: loginPassword,
            });

            handleLogin(response.accessToken, nextPath);
        } catch (error) {
            setLoginError(error instanceof Error ? error.message : '로그인하지 못했어요. 다시 시도해 주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };
    const handlePasswordSignup = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSignupError(null);

        if (!validateSignup()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await AuthAPI.passwordSignup({
                name: signupName.trim(),
                email: signupEmail.trim(),
                emailVerificationToken: signupEmailVerificationToken ?? undefined,
                password: signupPassword,
            });

            handleLogin(response.accessToken, ROUTE.REGISTER);
        } catch (error) {
            setSignupError(error instanceof Error ? error.message : '가입을 완료하지 못했어요. 다시 시도해 주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };
    const handlePasswordReset = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPasswordResetError(null);
        setPasswordResetMessage(null);

        if (!validatePasswordReset()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await AuthAPI.resetAdminPassword({
                email: passwordResetEmail.trim(),
                resetToken: passwordResetToken.trim(),
                newPassword: passwordResetNewPassword,
            });

            setLoginEmail(passwordResetEmail.trim());
            setPasswordResetNewPassword('');
            setPasswordResetNewPasswordConfirm('');
            setPasswordResetMessage('비밀번호가 변경됐어요. 새 비밀번호로 로그인해 주세요.');
        } catch (error) {
            setPasswordResetError(error instanceof Error ? error.message : '비밀번호를 변경하지 못했어요. 다시 시도해 주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-screen bg-white">
            <div className="hidden h-screen w-[calc(100vh/1080*1140)] min-w-0 shrink xl:block">
                <Carousel
                    autoPlay
                    infiniteLoop
                    dynamicHeight
                    stopOnHover
                    showArrows
                    interval={3000}
                    showIndicators={false}
                    showThumbs={false}
                    statusFormatter={(current, total) => `${current} / ${total}`}
                    renderArrowPrev={(click) => (
                        <BackCircle
                            className="absolute top-[50%] left-20 z-10 h-13 w-13 translate-y-[-50%] cursor-pointer"
                            onClick={click}
                        />
                    )}
                    renderArrowNext={(click) => (
                        <NextCircle
                            className="absolute top-[50%] right-20 z-10 h-13 w-13 translate-y-[-50%] cursor-pointer"
                            onClick={click}
                        />
                    )}
                >
                    <div className='h-screen w-full min-w-px bg-[url("/img/login_1.webp")] bg-cover bg-center'></div>
                    <div className='h-screen w-full min-w-px bg-[url("/img/login_2.webp")] bg-cover bg-center'></div>
                    <div className='h-screen w-full min-w-px bg-[url("/img/login_3.webp")] bg-cover bg-center'></div>
                </Carousel>
            </div>

            <div className="z-10 flex min-h-screen min-w-0 flex-1 shrink-0 flex-col items-center bg-white px-5 py-10 md:px-16 xl:px-26.25">
                <button type="button" className="flex cursor-pointer items-center" onClick={() => navigate(ROUTE.ROOT)}>
                    <img src="/img/group-19.png" alt="" aria-hidden="true" className="mt-8 h-[34px] w-auto max-w-[166px] object-contain" />
                </button>

                <div className={`mt-6 w-full ${isSignupPage ? 'max-w-[560px]' : 'max-w-[480px]'} md:mt-10`}>
                    {isDemoSignupFlow ? (
                        <div className="mb-6 rounded-[16px] border border-main-3/40 bg-main-light px-5 py-4">
                            <p className="font-apple text-sm font-semibold text-main-1">체험 계정을 정식 계정으로 전환해요</p>
                            <p className="mt-1 font-apple text-sm leading-6 text-sub-2.5">
                                계정을 만든 뒤 새 병동을 만들면 이후에도 데이터를 이어서 관리할 수 있어요.
                            </p>
                        </div>
                    ) : null}

                    <div className="mx-auto mt-7 w-[334px] text-center">
                        <h1 className="font-apple text-[32px] font-semibold text-text-1">{title}</h1>
                    </div>

                    {isPasswordResetPage ? (
                        <form onSubmit={handlePasswordReset} className="mx-auto mt-7 w-[334px] space-y-4">
                            <div>
                                <label htmlFor="password-reset-email" className="mb-1.5 block text-sm font-medium text-sub-2">
                                    이메일
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative min-w-0 flex-1">
                                        <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-4" />
                                        <input
                                            id="password-reset-email"
                                            value={passwordResetEmail}
                                            type="email"
                                            className={cn(getInputClassName(Boolean(passwordResetErrors.email)), 'pl-9')}
                                            placeholder="가입한 이메일"
                                            autoComplete="email"
                                            onChange={(event) => handlePasswordResetEmailChange(event.target.value)}
                                            aria-invalid={Boolean(passwordResetErrors.email)}
                                            aria-describedby={passwordResetErrors.email ? 'password-reset-email-error' : undefined}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        disabled={!isPasswordResetEmailValid || isRequestingPasswordReset}
                                        className="flex h-11 w-[104px] shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-sub-1 px-2 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-6 disabled:text-gray-3"
                                        onClick={handleRequestPasswordReset}
                                    >
                                        {isRequestingPasswordReset ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                        메일 보내기
                                    </button>
                                </div>
                                <FieldError id="password-reset-email-error" message={passwordResetErrors.email} />
                            </div>

                            {hasRequestedPasswordReset ? (
                                <>
                                    <div>
                                        <label htmlFor="password-reset-token" className="mb-1.5 block text-sm font-medium text-sub-2">
                                            재설정 코드
                                        </label>
                                        <input
                                            id="password-reset-token"
                                            value={passwordResetToken}
                                            type="text"
                                            className={getInputClassName(Boolean(passwordResetErrors.resetToken))}
                                            placeholder="메일로 받은 재설정 코드"
                                            autoComplete="one-time-code"
                                            onChange={(event) => setPasswordResetToken(event.target.value)}
                                            aria-invalid={Boolean(passwordResetErrors.resetToken)}
                                            aria-describedby={passwordResetErrors.resetToken ? 'password-reset-token-error' : undefined}
                                        />
                                        <FieldError id="password-reset-token-error" message={passwordResetErrors.resetToken} />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="password-reset-new-password"
                                            className="mb-1.5 block text-sm font-medium text-sub-2"
                                        >
                                            새 비밀번호
                                        </label>
                                        <input
                                            id="password-reset-new-password"
                                            value={passwordResetNewPassword}
                                            type="password"
                                            className={getInputClassName(Boolean(passwordResetErrors.newPassword))}
                                            placeholder="새 비밀번호를 입력해 주세요"
                                            autoComplete="new-password"
                                            onChange={(event) => setPasswordResetNewPassword(event.target.value)}
                                            aria-invalid={Boolean(passwordResetErrors.newPassword)}
                                            aria-describedby={
                                                passwordResetErrors.newPassword ? 'password-reset-new-password-error' : undefined
                                            }
                                        />
                                        <FieldError id="password-reset-new-password-error" message={passwordResetErrors.newPassword} />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="password-reset-new-password-confirm"
                                            className="mb-1.5 block text-sm font-medium text-sub-2"
                                        >
                                            새 비밀번호 확인
                                        </label>
                                        <input
                                            id="password-reset-new-password-confirm"
                                            value={passwordResetNewPasswordConfirm}
                                            type="password"
                                            className={getInputClassName(Boolean(passwordResetErrors.newPasswordConfirm))}
                                            placeholder="새 비밀번호를 다시 입력해 주세요"
                                            autoComplete="new-password"
                                            onChange={(event) => setPasswordResetNewPasswordConfirm(event.target.value)}
                                            aria-invalid={Boolean(passwordResetErrors.newPasswordConfirm)}
                                            aria-describedby={
                                                passwordResetErrors.newPasswordConfirm
                                                    ? 'password-reset-new-password-confirm-error'
                                                    : undefined
                                            }
                                        />
                                        <FieldError
                                            id="password-reset-new-password-confirm-error"
                                            message={passwordResetErrors.newPasswordConfirm}
                                        />
                                    </div>
                                </>
                            ) : null}

                            {passwordResetMessage ? (
                                <p role="status" className="rounded-[12px] bg-main-light px-3 py-2 text-sm text-main-1">
                                    {passwordResetMessage}
                                </p>
                            ) : null}
                            {passwordResetError ? (
                                <p role="alert" className="rounded-[12px] bg-[#FFF7F8] px-3 py-2 text-sm text-red">
                                    {passwordResetError}
                                </p>
                            ) : null}

                            <button
                                type="submit"
                                disabled={isPasswordResetSubmitDisabled}
                                className="mx-auto flex h-[44px] w-[334px] cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-[1px] border-main-1 bg-main-1 px-[12px] text-sm font-semibold text-white transition-colors hover:bg-[#5832E7] disabled:cursor-not-allowed disabled:border-transparent disabled:bg-gray-6 disabled:text-gray-3"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                비밀번호 변경
                            </button>
                            <p className="text-center text-sm text-gray-3">
                                비밀번호가 기억났나요?{' '}
                                <Link to={ROUTE.SIGN_IN} className="font-semibold text-main-1 underline underline-offset-[3px]">
                                    로그인
                                </Link>
                            </p>
                        </form>
                    ) : !isSignupPage ? (
                        <form onSubmit={handlePasswordLogin} className="mx-auto mt-7 w-[334px] space-y-4">
                            <div>
                                <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-sub-2">
                                    이메일
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-4" />
                                    <input
                                        id="login-email"
                                        value={loginEmail}
                                        type="email"
                                        className={`${FIELD_CLASS} pl-9`}
                                        placeholder="이메일을 입력하세요"
                                        autoComplete="email"
                                        onChange={(event) => setLoginEmail(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-sub-2">
                                    비밀번호
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-4" />
                                    <input
                                        id="login-password"
                                        value={loginPassword}
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        className={`${FIELD_CLASS} px-9`}
                                        placeholder="비밀번호를 입력하세요"
                                        autoComplete="current-password"
                                        onChange={(event) => setLoginPassword(event.target.value)}
                                    />
                                    <PasswordVisibilityButton
                                        visible={isPasswordVisible}
                                        onClick={() => setIsPasswordVisible((visible) => !visible)}
                                    />
                                </div>
                            </div>
                            {loginError ? (
                                <p role="alert" className="rounded-[12px] bg-[#FFF7F8] px-3 py-2 text-sm text-red">
                                    {loginError}
                                </p>
                            ) : null}
                            <button
                                type="submit"
                                disabled={isLoginDisabled}
                                className="mx-auto flex h-[44px] w-[334px] cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-[1px] border-main-1 bg-main-1 px-[12px] text-sm font-semibold text-white transition-colors hover:bg-[#5832E7] disabled:cursor-not-allowed disabled:border-transparent disabled:bg-gray-6 disabled:text-gray-3"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                로그인
                            </button>
                            <p className="text-center text-sm text-gray-3">
                                <Link
                                    to={`${ROUTE.SIGN_IN}?mode=${PASSWORD_RESET_MODE}`}
                                    className="font-semibold text-main-1 underline underline-offset-[3px]"
                                >
                                    비밀번호 찾기
                                </Link>
                            </p>
                            <p className="text-center text-sm text-gray-3">
                                아직 계정이 없나요?{' '}
                                <Link to={ROUTE.SIGN_UP} className="font-semibold text-main-1 underline underline-offset-[3px]">
                                    회원가입
                                </Link>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordSignup} className="mx-auto mt-7 w-[334px] space-y-4">
                            <div>
                                <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-sub-2">
                                    이름
                                </label>
                                <input
                                    id="signup-name"
                                    value={signupName}
                                    type="text"
                                    className={getInputClassName(Boolean(signupErrors.name))}
                                    placeholder="이름을 입력해 주세요"
                                    autoComplete="name"
                                    onChange={(event) => setSignupName(event.target.value)}
                                    aria-invalid={Boolean(signupErrors.name)}
                                    aria-describedby={signupErrors.name ? 'signup-name-error' : undefined}
                                />
                                <FieldError id="signup-name-error" message={signupErrors.name} />
                            </div>

                            <div>
                                <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-sub-2">
                                    이메일
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="signup-email"
                                        value={signupEmail}
                                        type="email"
                                        className={cn(getInputClassName(Boolean(signupErrors.email)), 'min-w-0')}
                                        placeholder="이메일을 입력해 주세요"
                                        autoComplete="email"
                                        onChange={(event) => handleSignupEmailChange(event.target.value)}
                                        aria-invalid={Boolean(signupErrors.email)}
                                        aria-describedby={signupErrors.email ? 'signup-email-error' : undefined}
                                    />
                                    <button
                                        type="button"
                                        disabled={!isSignupEmailValid || isSendingVerification || isSignupEmailVerified}
                                        className="flex h-11 w-[76px] shrink-0 cursor-pointer items-center justify-center rounded-[12px] bg-sub-1 px-2 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-6 disabled:text-gray-3"
                                        onClick={handleSendSignupEmailVerification}
                                    >
                                        {isSendingVerification ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : isSignupEmailVerified ? (
                                            '완료'
                                        ) : (
                                            '인증'
                                        )}
                                    </button>
                                </div>
                                <FieldError id="signup-email-error" message={signupErrors.email} />
                                {hasRequestedSignupVerification ? (
                                    <div className="mt-2">
                                        <input
                                            id="signup-verification-code"
                                            value={signupVerificationCode}
                                            type="text"
                                            className={getInputClassName(false)}
                                            placeholder="인증번호를 입력해 주세요"
                                            aria-label="이메일 인증번호"
                                            autoComplete="one-time-code"
                                            onChange={(event) => handleSignupVerificationCodeChange(event.target.value)}
                                        />
                                    </div>
                                ) : null}
                                {signupVerificationMessage ? <p className="mt-1 text-xs text-main-1">{signupVerificationMessage}</p> : null}
                                {signupVerificationError ? <p className="mt-1 text-xs text-red">{signupVerificationError}</p> : null}
                            </div>

                            <div>
                                <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-sub-2">
                                    비밀번호
                                </label>
                                <input
                                    id="signup-password"
                                    value={signupPassword}
                                    type="password"
                                    className={getInputClassName(Boolean(signupErrors.password))}
                                    placeholder="비밀번호를 입력해 주세요"
                                    autoComplete="new-password"
                                    onChange={(event) => setSignupPassword(event.target.value)}
                                    aria-invalid={Boolean(signupErrors.password)}
                                    aria-describedby={signupErrors.password ? 'signup-password-error' : undefined}
                                />
                                <FieldError id="signup-password-error" message={signupErrors.password} />
                            </div>

                            <div>
                                <label htmlFor="signup-password-confirm" className="mb-1.5 block text-sm font-medium text-sub-2">
                                    비밀번호 확인
                                </label>
                                <input
                                    id="signup-password-confirm"
                                    value={signupPasswordConfirm}
                                    type="password"
                                    className={getInputClassName(Boolean(signupErrors.passwordConfirm))}
                                    placeholder="비밀번호를 다시 입력해 주세요"
                                    autoComplete="new-password"
                                    onChange={(event) => setSignupPasswordConfirm(event.target.value)}
                                    aria-invalid={Boolean(signupErrors.passwordConfirm)}
                                    aria-describedby={signupErrors.passwordConfirm ? 'signup-password-confirm-error' : undefined}
                                />
                                <FieldError id="signup-password-confirm-error" message={signupErrors.passwordConfirm} />
                            </div>

                            {signupError ? (
                                <p role="alert" className="rounded-[12px] bg-[#FFF7F8] px-3 py-2 text-sm text-red">
                                    {signupError}
                                </p>
                            ) : null}

                            <button
                                type="submit"
                                disabled={isSignupDisabled}
                                className="mx-auto flex h-[44px] w-[334px] cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-[1px] border-main-1 bg-main-1 px-[12px] text-sm font-semibold text-white transition-colors hover:bg-[#5832E7] disabled:cursor-not-allowed disabled:border-transparent disabled:bg-gray-6 disabled:text-gray-3"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                계정 만들기
                            </button>
                            <p className="text-center text-sm text-gray-3">
                                이미 계정이 있나요?{' '}
                                <Link to={ROUTE.SIGN_IN} className="font-semibold text-main-1 underline underline-offset-[3px]">
                                    로그인
                                </Link>
                            </p>
                        </form>
                    )}

                    {!isPasswordResetPage ? (
                        <div className="mx-auto mt-7 w-[334px] border-t border-gray-6 pt-6">
                            <div className="grid grid-cols-1 gap-3">
                                <a
                                    href={kakaoAuthorizeUrl}
                                    className="mx-auto flex h-[44px] w-[334px] cursor-pointer items-center justify-center rounded-[12px] border border-[1px] border-[#F2D600] bg-[#FEE500] px-[12px] text-sm font-semibold text-sub-1 shadow-banner"
                                >
                                    <KakaoIcon className="mr-3 h-5 w-5" />
                                    {isSignupPage ? '카카오로 시작하기' : '카카오로 계속하기'}
                                </a>
                                {canUseDevSignupBypass ? (
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={handleDevSignupBypass}
                                        className="mx-auto flex h-[44px] w-[334px] cursor-pointer items-center justify-center rounded-[12px] border border-dashed border-gray-6 bg-white px-[12px] text-sm font-semibold text-gray-3 transition-colors hover:bg-gray-7 disabled:cursor-not-allowed disabled:text-gray-4"
                                    >
                                        DEV: skip Kakao signup
                                    </button>
                                ) : null}
                                <a
                                    href={appleAuthorizeUrl}
                                    className="mx-auto flex h-[44px] w-[334px] cursor-pointer items-center justify-center rounded-[12px] border border-[1px] border-[#231F20] bg-[#231F20] px-[12px] text-sm font-semibold text-white shadow-banner"
                                >
                                    <AppleIcon className="mr-3 h-5 w-5" />
                                    {isSignupPage ? 'Apple로 시작하기' : 'Apple로 계속하기'}
                                </a>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="mt-auto flex flex-wrap justify-center gap-x-2 gap-y-1 pt-8 font-apple text-sm text-sub-3">
                    <span>계속하면</span>
                    <a href={RUNTIME_CONFIG.docs.termsOfService} className="underline underline-offset-[3px]">
                        서비스 약관
                    </a>
                    <span>및</span>
                    <a href={RUNTIME_CONFIG.docs.privacyPolicy} className="underline underline-offset-[3px]">
                        개인정보 처리방침
                    </a>
                    <span>에 동의한 것으로 간주합니다.</span>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
