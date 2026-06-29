import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { FiArrowLeft, FiArrowRight, FiBriefcase, FiCalendar, FiDollarSign, FiMapPin, FiTool, FiTrendingUp } from 'react-icons/fi'
import { viewJobDetails } from '../../features/user/jobSlice'
import Spinner from '../../ui/Spinner'
import NoDataFound from '../../components/NoDataFound'

const Page = styled.div`
    max-width: 1180px;
    margin: 0 auto;
    padding: 34px 24px;

    @media (max-width: 640px) {
        padding: 24px 16px;
    }
`

const BackButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 18px;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text};
    padding: 10px 14px;
    font-weight: 500;
    cursor: pointer;
    transition: transform .18s ease, border-color .18s ease;

    &:hover {
        transform: translateY(-1px);
        border-color: ${({ theme }) => theme.primary};
    }
`

const DetailsGrid = styled.section`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 330px;
    gap: 22px;
    align-items: start;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`

const MainCard = styled.article`
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surface};
    box-shadow: ${({ theme }) => theme.shadow};
`

const Hero = styled.div`
    padding: 30px;
    background:
        linear-gradient(135deg, ${({ theme }) => theme.backgroundSoft}, ${({ theme }) => theme.surface});
    border-bottom: 1px solid ${({ theme }) => theme.border};

    h1 {
        margin: 0;
        font-size: clamp(30px, 5vw, 50px);
        font-weight: 500;
        line-height: 1.05;
        letter-spacing: 0;
    }

    p {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 12px 0 0;
        color: ${({ theme }) => theme.mutedText};
        font-weight: 500;
    }
`

const Body = styled.div`
    padding: 28px 30px 32px;

    h2 {
        margin: 0 0 10px;
        font-size: 20px;
    }

    p {
        color: ${({ theme }) => theme.mutedText};
        margin: 0;
    }
`

const SkillList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 18px;
`

const Skill = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 11px;
    border-radius: 999px;
    background: ${({ theme }) => theme.surfaceAlt};
    color: ${({ theme }) => theme.text};
    font-size: 13px;
    font-weight: 500;
`

const SideCard = styled.aside`
    position: sticky;
    top: 96px;
    padding: 22px;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surface};
    box-shadow: ${({ theme }) => theme.shadow};

    @media (max-width: 900px) {
        position: static;
    }
`

const SummaryList = styled.div`
    display: grid;
    gap: 12px;
    margin: 18px 0;
`

const SummaryItem = styled.div`
    display: grid;
    grid-template-columns: 38px 1fr;
    gap: 10px;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    background: ${({ theme }) => theme.surfaceAlt};

    svg {
        color: ${({ theme }) => theme.primary};
    }

    span {
        display: block;
        color: ${({ theme }) => theme.mutedText};
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
    }

    strong {
        color: ${({ theme }) => theme.text};
        text-transform: capitalize;
    }
`

const ApplyButton = styled.button`
    width: 100%;
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.primary};
    padding: 0 18px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 650;
    transition: transform .18s ease, background .18s ease, box-shadow .18s ease;

    &:hover {
        transform: translateY(-1px);
        background-color: ${({ theme }) => theme.primaryHover};
        box-shadow: 0 14px 28px rgba(15, 139, 141, 0.24);
    }

    &:disabled {
        cursor: not-allowed;
        transform: none;
        background: ${({ theme }) => theme.surfaceAlt};
        border-color: ${({ theme }) => theme.border};
        color: ${({ theme }) => theme.mutedText};
        box-shadow: none;
    }
`

const ErrorText = styled.p`
    color: ${({ theme }) => theme.danger};
`

const ClosedNotice = styled.div`
    margin-top: 12px;
    padding: 12px;
    border-radius: 8px;
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accent};
    font-weight: 500;
    font-size: 14px;
`

function formatDate(value) {
    if (!value) return 'Recently posted'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatJobType(type) {
    if (!type) return 'Full Time'
    return type.replace('_', ' ')
}

function getSkills(skills) {
    if (!skills) return []
    return skills.split(',').map((skill) => skill.trim()).filter(Boolean)
}

function isClosedJob(job) {
    return String(job?.status || '').trim().toLowerCase() === 'closed'
}

function normalizeDescription(value) {
    const text = String(value ?? '').trim()
    if (!text || text.toLowerCase() === 'undefined' || text.toLowerCase() === 'null') return ''
    return text
}

function getJobDescription(job) {
    return normalizeDescription(job?.description)
        || normalizeDescription(job?.job_description)
        || 'No job description has been added for this role yet.'
}

export default function JobDetails() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { jobDetails: jobDetailsFromStore, isLoading, error } = useSelector((state) => state.jobs)
    const jobDetails = Array.isArray(jobDetailsFromStore) ? jobDetailsFromStore[0] : jobDetailsFromStore

    useEffect(() => {
        dispatch(viewJobDetails(id))
    }, [id, dispatch])

    function handleApplyNow() {
        if (isClosedJob(jobDetails)) return

        const token = localStorage.getItem('token')
        if (token) {
            navigate(`/apply-job/${id}`)
            return
        }

        localStorage.setItem('savedId', id)
        navigate('/signup')
    }

    return (
        <Page>
            <BackButton type="button" onClick={() => navigate(-1)}><FiArrowLeft /> Back to jobs</BackButton>

            {isLoading && <Spinner />}
            {error && <ErrorText>Error: {error.message || error}</ErrorText>}

            {!isLoading && jobDetails ? (
                <DetailsGrid>
                    <MainCard>
                        <Hero>
                            <h1>{jobDetails.job_name}</h1>
                            <p><FiBriefcase /> {jobDetails.company_name || 'Hiring team'}</p>
                        </Hero>
                        <Body>
                            <h2>About this role</h2>
                            <p>{getJobDescription(jobDetails)}</p>

                            <SkillList>
                                {getSkills(jobDetails.skills).map((skill) => (
                                    <Skill key={skill}><FiTool /> {skill}</Skill>
                                ))}
                            </SkillList>
                        </Body>
                    </MainCard>

                    <SideCard>
                        <h2>Role snapshot</h2>
                        <SummaryList>
                            <SummaryItem>
                                <FiMapPin />
                                <div><span>Location</span><strong>{jobDetails.location || 'Remote'}</strong></div>
                            </SummaryItem>
                            <SummaryItem>
                                <FiDollarSign />
                                <div><span>Salary</span><strong>{jobDetails.job_salary || 'Undisclosed'}</strong></div>
                            </SummaryItem>
                            <SummaryItem>
                                <FiTrendingUp />
                                <div><span>Experience</span><strong>{jobDetails.experience_required || 'Entry Level'} years</strong></div>
                            </SummaryItem>
                            <SummaryItem>
                                <FiBriefcase />
                                <div><span>Type</span><strong>{formatJobType(jobDetails.job_type)}</strong></div>
                            </SummaryItem>
                            <SummaryItem>
                                <FiCalendar />
                                <div><span>Posted</span><strong>{formatDate(jobDetails.created_at)}</strong></div>
                            </SummaryItem>
                        </SummaryList>
                        {isClosedJob(jobDetails) ? (
                            <ClosedNotice>You can view this job, but applications are closed.</ClosedNotice>
                        ) : (
                            <ApplyButton type="button" onClick={handleApplyNow}>
                                Apply Now <FiArrowRight />
                            </ApplyButton>
                        )}
                    </SideCard>
                </DetailsGrid>
            ) : (
                !isLoading && (
                    <NoDataFound
                        title="No job details found"
                        message="This job may have been removed or is no longer available."
                    />
                )
            )}
        </Page>
    )
}
