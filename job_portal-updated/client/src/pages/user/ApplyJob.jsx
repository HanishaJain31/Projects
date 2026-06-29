import { useEffect } from 'react'
import styled from 'styled-components'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import {
    FiArrowLeft,
    FiArrowRight,
    FiBriefcase,
    FiCheckCircle,
    FiDollarSign,
    FiFileText,
    FiMail,
    FiMapPin,
    FiPhone,
    FiUploadCloud,
    FiUser,
} from 'react-icons/fi'
import { applyJob, viewJobDetails } from '../../features/user/jobSlice'
import getToastMessage from '../../utils/getToastMessage'

const Page = styled.div`
    max-width: 1180px;
    margin: 0 auto;
    padding: 34px 24px;
    color: ${({ theme }) => theme.text};

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
    transition: transform .18s ease, border-color .18s ease, background .18s ease;

    &:hover {
        transform: translateY(-1px);
        border-color: ${({ theme }) => theme.primary};
        background: ${({ theme }) => theme.surfaceAlt};
    }
`

const Shell = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 22px;
    align-items: start;

    @media (max-width: 940px) {
        grid-template-columns: 1fr;
    }
`

const FormCard = styled.section`
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surface};
    box-shadow: ${({ theme }) => theme.shadow};
`

const FormHero = styled.div`
    padding: 30px;
    background: linear-gradient(135deg, ${({ theme }) => theme.backgroundSoft}, ${({ theme }) => theme.surface});
    border-bottom: 1px solid ${({ theme }) => theme.border};

    span {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding: 7px 12px;
        border-radius: 999px;
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accent};
        font-size: 13px;
        font-weight: 650;
    }

    h1 {
        margin: 0;
        font-size: clamp(30px, 5vw, 48px);
        line-height: 1.05;
        letter-spacing: 0;
    }

    p {
        max-width: 650px;
        margin: 10px 0 0;
        color: ${({ theme }) => theme.mutedText};
    }
`

const Form = styled.form`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
    padding: 28px 30px 32px;

    @media (max-width: 700px) {
        grid-template-columns: 1fr;
        padding: 22px 18px 26px;
    }
`

const Field = styled.label`
    display: grid;
    gap: 8px;
    min-width: 0;

    span {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        color: ${({ theme }) => theme.text};
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

const InputBase = styled.input`
    width: 100%;
    min-height: 48px;
    padding: 0 14px;
    background: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme, $error }) => ($error ? theme.danger : theme.border)};
    border-radius: 8px;
    font-size: 15px;
    box-shadow: ${({ $error, theme }) => ($error ? `0 0 0 4px ${theme.danger}22` : 'none')};
    transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme, $error }) => ($error ? theme.danger : theme.primary)};
        box-shadow: ${({ $error, theme }) => ($error ? `0 0 0 4px ${theme.danger}22` : '0 0 0 4px rgba(15, 139, 141, 0.14)')};
        transform: translateY(-1px);
    }
`

const Textarea = styled.textarea`
    width: 100%;
    min-height: 150px;
    padding: 14px;
    resize: vertical;
    background: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme, $error }) => ($error ? theme.danger : theme.border)};
    border-radius: 8px;
    font-size: 15px;
    font-family: inherit;
    box-shadow: ${({ $error, theme }) => ($error ? `0 0 0 4px ${theme.danger}22` : 'none')};
    transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme, $error }) => ($error ? theme.danger : theme.primary)};
        box-shadow: ${({ $error, theme }) => ($error ? `0 0 0 4px ${theme.danger}22` : '0 0 0 4px rgba(15, 139, 141, 0.14)')};
        transform: translateY(-1px);
    }
`

const UploadBox = styled.label`
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 54px minmax(0, 1fr);
    gap: 14px;
    align-items: center;
    padding: 18px;
    border: 1px dashed ${({ theme, $error }) => ($error ? theme.danger : theme.border)};
    border-radius: 8px;
    background: ${({ theme }) => theme.surfaceAlt};
    cursor: pointer;
    transition: border-color .18s ease, background .18s ease, transform .18s ease;

    &:hover {
        transform: translateY(-1px);
        border-color: ${({ theme }) => theme.primary};
        background: ${({ theme }) => theme.backgroundSoft};
    }

    input {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
    }
`

const UploadIcon = styled.span`
    width: 54px;
    height: 54px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    background: ${({ theme }) => theme.primary};
    color: #fff;
`

const UploadText = styled.div`
    min-width: 0;

    strong {
        display: block;
        color: ${({ theme }) => theme.text};
        font-size: 15px;
    }

    p {
        margin: 4px 0 0;
        color: ${({ theme }) => theme.mutedText};
        font-size: 13px;
        overflow-wrap: anywhere;
    }
`

const ErrorText = styled.p`
    margin: -2px 0 0;
    color: ${({ theme }) => theme.danger};
    font-size: 13px;
    font-weight: 550;
`

const SubmitRow = styled.div`
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 8px;

    @media (max-width: 520px) {
        flex-direction: column;
    }
`

const SecondaryButton = styled.button`
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 18px;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text};
    font-weight: 650;
    cursor: pointer;
    transition: transform .18s ease, border-color .18s ease, background .18s ease;

    &:hover {
        transform: translateY(-1px);
        border-color: ${({ theme }) => theme.primary};
        background: ${({ theme }) => theme.surfaceAlt};
    }
`

const ApplyButton = styled.button`
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 20px;
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.primary};
    border-radius: 8px;
    font-size: 15px;
    font-weight: 650;
    cursor: pointer;
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

const SummaryCard = styled.aside`
    position: sticky;
    top: 96px;
    padding: 22px;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surface};
    box-shadow: ${({ theme }) => theme.shadow};

    @media (max-width: 940px) {
        position: static;
    }

    h2 {
        margin: 0 0 8px;
        font-size: 22px;
    }

    > p {
        margin: 0;
        color: ${({ theme }) => theme.mutedText};
    }
`

const Badge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 16px;
    padding: 7px 11px;
    border-radius: 999px;
    background: rgba(18, 158, 99, 0.12);
    color: ${({ theme }) => theme.success};
    font-size: 12px;
    font-weight: 650;
    text-transform: uppercase;
`

const SummaryList = styled.div`
    display: grid;
    gap: 10px;
    margin-top: 18px;
`

const SummaryItem = styled.div`
    display: grid;
    grid-template-columns: 36px 1fr;
    gap: 10px;
    align-items: center;
    padding: 11px;
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

const ClosedPanel = styled.div`
    max-width: 620px;
    padding: 26px;
    background: ${({ theme }) => theme.surface};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    box-shadow: ${({ theme }) => theme.shadow};

    h2 {
        margin: 0;
    }

    p {
        margin: 8px 0 18px;
        color: ${({ theme }) => theme.mutedText};
    }
`

function isClosedJob(job) {
    return String(job?.status || '').trim().toLowerCase() === 'closed'
}

function formatJobType(type) {
    if (!type) return 'Full Time'
    return type.replace('_', ' ')
}

export default function ApplyJob() {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const { jobDetails, isLoading } = useSelector((state) => state.jobs)

    const resumeValue = useWatch({ control, name: 'resume' })
    const resumeFile = resumeValue?.[0]
    const selectedJob = Array.isArray(jobDetails) ? jobDetails[0] : jobDetails
    const jobName = String(selectedJob?.id) === id ? selectedJob.job_name : ''
    const isClosed = String(selectedJob?.id) === id && isClosedJob(selectedJob)

    useEffect(() => {
        dispatch(viewJobDetails(id))
    }, [dispatch, id])

    async function onSubmit(data) {
        if (isClosed) {
            toast.error('Applications are closed for this job.')
            return
        }

        const formData = new FormData()
        formData.append('job_id', id)
        formData.append('candidate_name', data.fullname)
        formData.append('email', data.email)
        formData.append('phone_number', data.phone)
        formData.append('job_applied', jobName)
        formData.append('resume', data.resume[0])
        formData.append('cover_letter', data.coverLetter)

        const action = await dispatch(applyJob(formData))

        if (applyJob.fulfilled.match(action) && action.payload.code === '1') {
            toast.success('Application submitted successfully')
            reset()
        } else {
            toast.error(getToastMessage(action.payload, 'Could not submit application'))
        }
    }

    return (
        <Page>
            <BackButton type="button" onClick={() => navigate(`/job/${id}`)}><FiArrowLeft /> Back to job</BackButton>

            {isClosed ? (
                <ClosedPanel>
                    <Badge><FiCheckCircle /> Closed</Badge>
                    <h2>Applications Closed</h2>
                    <p>You can still view this job's details, but new applications are no longer accepted.</p>
                    <SecondaryButton type="button" onClick={() => navigate(`/job/${id}`)}>View Job Details</SecondaryButton>
                </ClosedPanel>
            ) : (
                <Shell>
                    <FormCard>
                        <FormHero>
                            <span><FiFileText /> Application Form</span>
                            <h1>Apply for {jobName || 'this role'}</h1>
                            <p>Share your contact details, resume, and a short note for the hiring team.</p>
                        </FormHero>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Field>
                                <span><FiUser /> Full Name</span>
                                <InputBase
                                    type="text"
                                    placeholder="Enter your full name"
                                    $error={!!errors.fullname}
                                    {...register('fullname', { required: 'Full name is required' })}
                                />
                                {errors.fullname && <ErrorText>{errors.fullname.message}</ErrorText>}
                            </Field>

                            <Field>
                                <span><FiMail /> Email</span>
                                <InputBase
                                    type="email"
                                    placeholder="name@example.com"
                                    $error={!!errors.email}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                />
                                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
                            </Field>

                            <Field>
                                <span><FiPhone /> Phone Number</span>
                                <InputBase
                                    type="text"
                                    placeholder="10 digit phone number"
                                    $error={!!errors.phone}
                                    {...register('phone', {
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: 'Invalid phone number',
                                        },
                                    })}
                                />
                                {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
                            </Field>

                            <Field>
                                <span><FiBriefcase /> Role</span>
                                <InputBase type="text" value={jobName || 'Loading role...'} readOnly />
                            </Field>

                            <FullField>
                                <span><FiFileText /> Cover Letter</span>
                                <Textarea
                                    placeholder="Write a concise note about your fit for this role"
                                    $error={!!errors.coverLetter}
                                    {...register('coverLetter', {
                                        required: 'Cover letter is required',
                                        minLength: { value: 20, message: 'Cover letter must be at least 20 characters' },
                                    })}
                                />
                                {errors.coverLetter && <ErrorText>{errors.coverLetter.message}</ErrorText>}
                            </FullField>

                            <UploadBox $error={!!errors.resume}>
                                <UploadIcon><FiUploadCloud size={24} /></UploadIcon>
                                <UploadText>
                                    <strong>{resumeFile ? resumeFile.name : 'Upload resume'}</strong>
                                    <p>{resumeFile ? `${Math.ceil(resumeFile.size / 1024)} KB selected` : 'PDF or document file preferred'}</p>
                                </UploadText>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    {...register('resume', { required: 'Resume is required' })}
                                />
                            </UploadBox>
                            {errors.resume && <ErrorText>{errors.resume.message}</ErrorText>}

                            <SubmitRow>
                                <SecondaryButton type="button" onClick={() => navigate(`/job/${id}`)}>Cancel</SecondaryButton>
                                <ApplyButton type="submit" disabled={isLoading || !jobName}>
                                    {isLoading ? 'Submitting...' : <>Submit Application <FiArrowRight /></>}
                                </ApplyButton>
                            </SubmitRow>
                        </Form>
                    </FormCard>

                    <SummaryCard>
                        <Badge><FiCheckCircle /> Active</Badge>
                        <h2>{jobName || 'Job details'}</h2>
                        <p>{selectedJob?.company_name || 'Hiring team'}</p>
                        <SummaryList>
                            <SummaryItem>
                                <FiMapPin />
                                <div><span>Location</span><strong>{selectedJob?.location || 'Remote'}</strong></div>
                            </SummaryItem>
                            <SummaryItem>
                                <FiDollarSign />
                                <div><span>Salary</span><strong>{selectedJob?.job_salary || 'Undisclosed'}</strong></div>
                            </SummaryItem>
                            <SummaryItem>
                                <FiBriefcase />
                                <div><span>Type</span><strong>{formatJobType(selectedJob?.job_type)}</strong></div>
                            </SummaryItem>
                            <SummaryItem>
                                <FiFileText />
                                <div><span>Status</span><strong>{selectedJob?.status || 'Active'}</strong></div>
                            </SummaryItem>
                        </SummaryList>
                    </SummaryCard>
                </Shell>
            )}
        </Page>
    )
}
