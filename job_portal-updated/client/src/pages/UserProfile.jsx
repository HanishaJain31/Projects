import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import {
    FiBriefcase,
    FiDownload,
    FiEdit3,
    FiFileText,
    FiKey,
    FiMail,
    FiPhone,
    FiShield,
    FiUser,
} from 'react-icons/fi'
import Spinner from '../ui/Spinner'
import { getProfile } from '../features/auth/authSlice'
import getToastMessage from '../utils/getToastMessage'
import EditProfile from './user/EditProfile'
import ChangePassword from './user/ChangePassword'

const Page = styled.div`
    max-width: 1180px;
    min-height: 76vh;
    margin: 0 auto;
    padding: 38px 24px;
    color: ${({ theme }) => theme.text};

    @media (max-width: 640px) {
        padding: 26px 16px;
    }
`

const Hero = styled.section`
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 24px;
    align-items: center;
    padding: 32px;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: linear-gradient(135deg, ${({ theme }) => theme.surface}, ${({ theme }) => theme.backgroundSoft});
    box-shadow: ${({ theme }) => theme.shadow};

    @media (max-width: 780px) {
        grid-template-columns: 1fr;
        padding: 24px 18px;
    }
`

const Identity = styled.div`
    display: flex;
    align-items: center;
    gap: 18px;
    min-width: 0;

    @media (max-width: 560px) {
        align-items: flex-start;
        flex-direction: column;
    }
`

const Avatar = styled.div`
    width: 86px;
    height: 86px;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: ${({ theme }) => theme.primary};
    color: #fff;
    font-size: 34px;
    font-weight: 400;
    box-shadow: 0 16px 34px rgba(15, 139, 141, 0.28);
`

const TitleBlock = styled.div`
    min-width: 0;

    span {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        margin-bottom: 8px;
        padding: 7px 11px;
        border-radius: 999px;
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accent};
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
    }

    h1 {
        margin: 0;
        font-size: clamp(32px, 5vw, 35px);
        line-height: 1.02;
        letter-spacing: 0;
        overflow-wrap: anywhere;
    }

    p {
        margin: 8px 0 0;
        color: ${({ theme }) => theme.mutedText};
        font-weight: 500;
    }
`

const HeroActions = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;

    @media (max-width: 780px) {
        justify-content: flex-start;
    }
`

const ActionButton = styled.button`
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 14px;
    border: 1px solid ${({ theme, $primary }) => ($primary ? theme.primary : theme.border)};
    border-radius: 8px;
    background: ${({ theme, $primary }) => ($primary ? theme.primary : theme.surface)};
    color: ${({ theme, $primary }) => ($primary ? '#fff' : theme.text)};
    font-weight: 550;
    cursor: pointer;
    transition: transform .18s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease;

    &:hover {
        transform: translateY(-1px);
        background: ${({ theme, $primary }) => ($primary ? theme.primaryHover : theme.surfaceAlt)};
        border-color: ${({ theme }) => theme.primary};
        box-shadow: ${({ $primary }) => ($primary ? '0 12px 24px rgba(15, 139, 141, 0.22)' : 'none')};
    }
`

const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 22px;
    margin-top: 22px;

    @media (max-width: 940px) {
        grid-template-columns: 1fr;
    }
`

const Panel = styled.section`
    padding: 24px;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surface};
    box-shadow: 0 12px 30px rgba(20, 33, 61, 0.06);
`

const PanelHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 18px;

    h2 {
        margin: 0;
        font-size: 22px;
    }

    p {
        margin: 4px 0 0;
        color: ${({ theme }) => theme.mutedText};
    }
`

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`

const InfoCard = styled.div`
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 12px;
    align-items: center;
    min-height: 82px;
    padding: 14px;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surfaceAlt};
    transition: transform .18s ease, border-color .18s ease, background .18s ease;

    &:hover {
        transform: translateY(-2px);
        border-color: ${({ theme }) => theme.primary};
        background: ${({ theme }) => theme.backgroundSoft};
    }
`

const IconBubble = styled.span`
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    background: ${({ theme }) => theme.primary}18;
    color: ${({ theme }) => theme.primary};
`

const InfoText = styled.div`
    min-width: 0;

    span {
        display: block;
        color: ${({ theme }) => theme.mutedText};
        font-size: 12px;
        font-weight: 650;
        text-transform: uppercase;
    }

    strong {
        display: block;
        color: ${({ theme }) => theme.text};
        overflow-wrap: anywhere;
    }
`

const SidePanel = styled(Panel)`
    position: sticky;
    top: 96px;
    align-self: start;

    @media (max-width: 940px) {
        position: static;
    }
`

const ResumeBox = styled.div`
    display: grid;
    gap: 14px;
    padding: 18px;
    border: 1px dashed ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surfaceAlt};
`

const ResumeLink = styled.a`
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 8px;
    background: ${({ theme }) => theme.primary};
    color: #fff;
    font-weight: 650;
    transition: transform .18s ease, background .18s ease, box-shadow .18s ease;

    &:hover {
        transform: translateY(-1px);
        background: ${({ theme }) => theme.primaryHover};
        box-shadow: 0 12px 24px rgba(15, 139, 141, 0.22);
    }
`

const EmptyResume = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.mutedText};
`

const QuickActions = styled.div`
    display: grid;
    gap: 10px;
    margin-top: 16px;
`

const ErrorText = styled.p`
    margin: 22px 0 0;
    color: ${({ theme }) => theme.danger};
    font-weight: 500;
`

function getResumeUrl(resumePath) {
    if (!resumePath) return ''
    if (/^https?:\/\//i.test(resumePath)) return resumePath

    const apiBase = import.meta.env.VITE_API_URL || ''
    const serverBase = apiBase.replace(/\/api\/v\d+\/?$/, '')
    const normalizedPath = resumePath.startsWith('/') ? resumePath : `/${resumePath}`

    return `${serverBase}${normalizedPath}`
}

function getInitials(name = '') {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (!parts.length) return 'U'
    return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

export default function UserProfile() {
    const dispatch = useDispatch()
    const { profile, isLoading, error, role } = useSelector((state) => state.auth)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

    const currentRole = profile?.role || role || localStorage.getItem('role')
    const isAdmin = currentRole === 'admin'
    const title = isAdmin ? 'Admin Profile' : 'User Profile'
    const resumeUrl = getResumeUrl(profile?.resume_path)

    useEffect(() => {
        dispatch(getProfile())
    }, [dispatch])

    return (
        <Page>
            {isLoading && <Spinner />}
            {error && <ErrorText>{getToastMessage(error, 'Failed to fetch profile')}</ErrorText>}

            {profile && !isLoading && (
                <>
                    <Hero>
                        <Identity>
                            <Avatar>{getInitials(profile.name)}</Avatar>
                            <TitleBlock>
                                <span><FiShield /> {title}</span>
                                <h1>{profile.name || 'Profile'}</h1>
                                <p>{profile.job_role || profile.email || 'Keep your account details fresh.'}</p>
                            </TitleBlock>
                        </Identity>
                        <HeroActions>
                            {/* <ActionButton type="button" onClick={() => setIsChangePasswordOpen(true)}><FiKey /> Password</ActionButton>
                            <ActionButton type="button" $primary onClick={() => setIsEditOpen(true)}><FiEdit3 /> Edit Profile</ActionButton> */}
                        </HeroActions>
                    </Hero>

                    <ContentGrid>
                        <Panel>
                            <PanelHeader>
                                <div>
                                    <h2>Profile Details</h2>
                                    <p>Your contact and account information.</p>
                                </div>
                            </PanelHeader>

                            <InfoGrid>
                                <InfoCard>
                                    <IconBubble><FiUser /></IconBubble>
                                    <InfoText><span>Name</span><strong>{profile.name || 'N/A'}</strong></InfoText>
                                </InfoCard>
                                <InfoCard>
                                    <IconBubble><FiMail /></IconBubble>
                                    <InfoText><span>Email</span><strong>{profile.email || 'N/A'}</strong></InfoText>
                                </InfoCard>
                                <InfoCard>
                                    <IconBubble><FiPhone /></IconBubble>
                                    <InfoText><span>Phone</span><strong>{profile.phone_number || 'N/A'}</strong></InfoText>
                                </InfoCard>
                                <InfoCard>
                                    <IconBubble><FiShield /></IconBubble>
                                    <InfoText><span>Role</span><strong>{profile.role || currentRole || 'N/A'}</strong></InfoText>
                                </InfoCard>
                                {!isAdmin && (
                                    <InfoCard>
                                        <IconBubble><FiBriefcase /></IconBubble>
                                        <InfoText><span>Job Role</span><strong>{profile.job_role || 'N/A'}</strong></InfoText>
                                    </InfoCard>
                                )}
                            </InfoGrid>
                        </Panel>

                        <SidePanel>
                            <PanelHeader>
                                <div>
                                    <h2>Career File</h2>
                                    <p>Resume and account actions.</p>
                                </div>
                            </PanelHeader>

                            <ResumeBox>
                                <IconBubble><FiFileText /></IconBubble>
                                {resumeUrl ? (
                                    <ResumeLink href={resumeUrl} target="_blank" rel="noreferrer">
                                        <FiDownload /> Open Resume
                                    </ResumeLink>
                                ) : (
                                    <EmptyResume>No resume is attached to this profile.</EmptyResume>
                                )}
                            </ResumeBox>

                            <QuickActions>
                                <ActionButton type="button" onClick={() => setIsEditOpen(true)}><FiEdit3 /> Update Details</ActionButton>
                                <ActionButton type="button" onClick={() => setIsChangePasswordOpen(true)}><FiKey /> Change Password</ActionButton>
                            </QuickActions>
                        </SidePanel>
                    </ContentGrid>
                </>
            )}

            <EditProfile
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                profile={profile}
            />

            <ChangePassword
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            />
        </Page>
    )
}
