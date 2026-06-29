import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { toast } from 'react-hot-toast'
import { FiKey, FiLock, FiSave, FiShield, FiX } from 'react-icons/fi'
import { editPassword } from '../../features/auth/authSlice'
import getToastMessage from '../../utils/getToastMessage'

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: ${({ theme }) => theme.overlay};
    z-index: 1000;
`

const Modal = styled.div`
    width: min(100%, 500px);
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    box-shadow: ${({ theme }) => theme.shadowStrong};
`

const Header = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 24px;
    background: linear-gradient(135deg, ${({ theme }) => theme.backgroundSoft}, ${({ theme }) => theme.surface});
    border-bottom: 1px solid ${({ theme }) => theme.border};
`

const Title = styled.h2`
    margin: 0;
    font-size: 26px;
`

const Subtitle = styled.p`
    margin: 5px 0 0;
    color: ${({ theme }) => theme.mutedText};
`

const CloseButton = styled.button`
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    transition: transform .18s ease, border-color .18s ease;

    &:hover {
        transform: translateY(-1px);
        border-color: ${({ theme }) => theme.primary};
    }
`

const SecurityNote = styled.div`
    display: grid;
    grid-template-columns: 42px 1fr;
    gap: 12px;
    align-items: center;
    margin: 20px 24px 0;
    padding: 14px;
    border-radius: 8px;
    background: ${({ theme }) => theme.surfaceAlt};
    color: ${({ theme }) => theme.mutedText};

    svg {
        color: ${({ theme }) => theme.primary};
    }

    strong {
        display: block;
        color: ${({ theme }) => theme.text};
    }

    p {
        margin: 2px 0 0;
    }
`

const Form = styled.form`
    display: grid;
    gap: 16px;
    padding: 24px;
`

const Field = styled.label`
    display: grid;
    gap: 8px;

    span {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-size: 13px;
        font-weight: 650;
    }

    svg {
        color: ${({ theme }) => theme.primary};
    }
`

const Input = styled.input`
    width: 100%;
    min-height: 46px;
    padding: 0 13px;
    background: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme, $error }) => ($error ? theme.danger : theme.border)};
    border-radius: 8px;
    font-size: 15px;
    transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;

    &:focus {
        outline: none;
        transform: translateY(-1px);
        border-color: ${({ theme, $error }) => ($error ? theme.danger : theme.primary)};
        box-shadow: ${({ $error, theme }) => ($error ? `0 0 0 4px ${theme.danger}22` : '0 0 0 4px rgba(15, 139, 141, 0.14)')};
    }
`

const ErrorText = styled.p`
    margin: -2px 0 0;
    color: ${({ theme }) => theme.danger};
    font-size: 13px;
    font-weight: 550;
`

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 4px;

    @media (max-width: 520px) {
        flex-direction: column;
    }
`

const Button = styled.button`
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 16px;
    border-radius: 8px;
    background: ${({ theme, variant }) => (variant === 'secondary' ? theme.surfaceAlt : theme.primary)};
    color: ${({ theme, variant }) => (variant === 'secondary' ? theme.text : '#fff')};
    border: 1px solid ${({ theme, variant }) => (variant === 'secondary' ? theme.border : theme.primary)};
    font-weight: 650;
    cursor: pointer;
    transition: transform .18s ease, background .18s ease, border-color .18s ease;

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        transform: translateY(-1px);
        background: ${({ theme, variant }) => (variant === 'secondary' ? theme.card : theme.primaryHover)};
        border-color: ${({ theme }) => theme.primary};
    }
`

export default function ChangePassword({ isOpen, onClose }) {
    const dispatch = useDispatch()
    const { isLoading } = useSelector((state) => state.auth)
    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm()

    if (!isOpen) return null

    async function onSubmit(data) {
        const action = await dispatch(editPassword({
            old_password: data.old_password,
            new_password: data.new_password,
        }))

        if (editPassword.fulfilled.match(action)) {
            toast.success(getToastMessage(action.payload, 'Password changed successfully!'))
            reset()
            onClose()
        } else {
            toast.error(getToastMessage(action.payload, 'Password change failed'))
        }
    }

    function handleClose() {
        reset()
        onClose()
    }

    return (
        <Overlay onClick={handleClose}>
            <Modal onClick={(event) => event.stopPropagation()}>
                <Header>
                    <div>
                        <Title>Change Password</Title>
                        <Subtitle>Use a fresh password to keep your account secure.</Subtitle>
                    </div>
                    <CloseButton type="button" onClick={handleClose} aria-label="Close"><FiX /></CloseButton>
                </Header>

                <SecurityNote>
                    <FiShield size={22} />
                    <div>
                        <strong>Security check</strong>
                        <p>Confirm your current password before saving a new one.</p>
                    </div>
                </SecurityNote>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Field>
                        <span><FiKey /> Current Password</span>
                        <Input
                            type="password"
                            placeholder="Old Password"
                            $error={!!errors.old_password}
                            {...register('old_password', { required: 'Old password is required' })}
                        />
                        {errors.old_password && <ErrorText>{errors.old_password.message}</ErrorText>}
                    </Field>

                    <Field>
                        <span><FiLock /> New Password</span>
                        <Input
                            type="password"
                            placeholder="New Password"
                            $error={!!errors.new_password}
                            {...register('new_password', {
                                required: 'New password is required',
                                minLength: {
                                    value: 6,
                                    message: 'New password must be at least 6 characters',
                                },
                            })}
                        />
                        {errors.new_password && <ErrorText>{errors.new_password.message}</ErrorText>}
                    </Field>

                    <Field>
                        <span><FiLock /> Confirm Password</span>
                        <Input
                            type="password"
                            placeholder="Confirm New Password"
                            $error={!!errors.confirm_password}
                            {...register('confirm_password', {
                                required: 'Please confirm your new password',
                                validate: (value) => value === getValues('new_password') || 'Passwords do not match',
                            })}
                        />
                        {errors.confirm_password && <ErrorText>{errors.confirm_password.message}</ErrorText>}
                    </Field>

                    <Actions>
                        <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}><FiSave /> {isLoading ? 'Saving...' : 'Save Password'}</Button>
                    </Actions>
                </Form>
            </Modal>
        </Overlay>
    )
}
