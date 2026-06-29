import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { toast } from 'react-hot-toast'
import { FiBriefcase, FiMail, FiPhone, FiSave, FiUser, FiX } from 'react-icons/fi'
import { editUserProfile, getProfile } from '../../features/auth/authSlice'
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
    width: min(100%, 560px);
    max-height: 90vh;
    overflow-y: auto;
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

const Form = styled.form`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    padding: 24px;

    @media (max-width: 620px) {
        grid-template-columns: 1fr;
    }
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

const FullField = styled(Field)`
    grid-column: 1 / -1;
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
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 8px;

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

export default function EditProfile({ isOpen, onClose, profile }) {
    const dispatch = useDispatch()
    const { isLoading, role } = useSelector((state) => state.auth)
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const currentRole = profile?.role || role || localStorage.getItem('role')
    const isAdmin = currentRole === 'admin'

    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || '',
                email: profile.email || '',
                phone_number: profile.phone_number || '',
                job_role: profile.job_role || '',
            })
        }
    }, [profile, reset])

    if (!isOpen) return null

    async function onSubmit(data) {
        const payload = {
            name: data.name,
            email: data.email,
            phone_number: data.phone_number,
        }

        if (!isAdmin) {
            payload.job_role = data.job_role
        }

        const action = await dispatch(editUserProfile(payload))

        if (editUserProfile.fulfilled.match(action)) {
            toast.success('Profile updated successfully!')
            await dispatch(getProfile())
            onClose()
        } else {
            toast.error(getToastMessage(action.payload, 'Profile update failed'))
        }
    }

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={(event) => event.stopPropagation()}>
                <Header>
                    <div>
                        <Title>Edit Profile</Title>
                        <Subtitle>Keep your contact details accurate for hiring teams.</Subtitle>
                    </div>
                    <CloseButton type="button" onClick={onClose} aria-label="Close"><FiX /></CloseButton>
                </Header>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Field>
                        <span><FiUser /> Name</span>
                        <Input type="text" placeholder="Name" $error={!!errors.name} {...register('name', { required: 'Name is required' })} />
                        {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
                    </Field>

                    <Field>
                        <span><FiMail /> Email</span>
                        <Input type="email" placeholder="Email" $error={!!errors.email} {...register('email', { required: 'Email is required' })} />
                        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
                    </Field>

                    <Field>
                        <span><FiPhone /> Phone Number</span>
                        <Input type="text" placeholder="Phone Number" $error={!!errors.phone_number} {...register('phone_number', { required: 'Phone number is required' })} />
                        {errors.phone_number && <ErrorText>{errors.phone_number.message}</ErrorText>}
                    </Field>

                    {!isAdmin && (
                        <FullField>
                            <span><FiBriefcase /> Job Role</span>
                            <Input type="text" placeholder="Job Role" $error={!!errors.job_role} {...register('job_role', { required: 'Job role is required' })} />
                            {errors.job_role && <ErrorText>{errors.job_role.message}</ErrorText>}
                        </FullField>
                    )}

                    <Actions>
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}><FiSave /> {isLoading ? 'Saving...' : 'Save Changes'}</Button>
                    </Actions>
                </Form>
            </Modal>
        </Overlay>
    )
}
