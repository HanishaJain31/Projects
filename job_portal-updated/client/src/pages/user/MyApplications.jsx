import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { jobsApplied } from '../../features/user/userProfileSlice'
import Spinner from '../../ui/Spinner'
import NoDataFound from '../../components/NoDataFound'

const Page = styled.div`
    min-height: 100vh;
    padding: 48px;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
`

// const Header = styled.div`
//     margin-bottom: 30px;
//     padding: 32px;
//     border-radius: 24px;
//     color: #fff;
//     background: linear-gradient(135deg, #243b55 0%, #617891 58%, #8aa4bf 100%);
//     box-shadow: 0 20px 45px rgba(36, 59, 85, 0.22);
// `

// const Title = styled.h1`
//     margin: 0 0 8px;
//     font-size: clamp(28px, 4vw, 40px);
//     font-weight: 500;
//     letter-spacing: -0.03em;
// `

// const Subtitle = styled.p`
//     margin: 0;
//     color: rgba(255, 255, 255, 0.82);
//     font-size: 16px;
// `

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 22px;
`

const Card = styled.article`
    overflow: hidden;
    background: ${({ theme }) => theme.surface};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 22px;
    box-shadow: ${({ theme }) => theme.shadow};
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.15);
    }
`

const CardTop = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 22px 22px 16px;
`

const JobTitle = styled.h2`
    margin: 0 0 6px;
    color: ${({ theme }) => theme.text};
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.2;
`

const Company = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.mutedText};
    font-weight: 500;
`

const StatusBadge = styled.span`
    flex-shrink: 0;
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
    text-transform: capitalize;
    color: ${(props) => {
        if (props.status === 'approved') return '#166534'
        if (props.status === 'rejected') return '#991b1b'
        return '#92400e'
    }};
    background: ${(props) => {
        if (props.status === 'approved') return '#dcfce7'
        if (props.status === 'rejected') return '#fee2e2'
        return '#fef3c7'
    }};
`

const Details = styled.div`
    display: grid;
    gap: 12px;
    padding: 0 22px 22px;
`

const DetailRow = styled.div`
    padding: 12px 14px;
    border-radius: 14px;
    background: ${({ theme }) => theme.surfaceAlt};
`

const Label = styled.p`
    margin: 0 0 4px;
    color: ${({ theme }) => theme.mutedText};
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
`

const Value = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.text};
    font-weight: 500;
`

const ErrorText = styled.p`
    padding: 14px 16px;
    border-radius: 12px;
    color: #991b1b;
    background: #fee2e2;
    border: 1px solid #fecaca;
`

function formatDate(date) {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

export default function MyApplications() {
    const dispatch = useDispatch()
    const { applications, isLoading, error } = useSelector((state) => state.profile)

    useEffect(() => {
        dispatch(jobsApplied())
    }, [dispatch])

    return (
        <Page>
            {/* <Header>
                <Title>My Applications</Title>
                <Subtitle>View your job applications and their status.</Subtitle>
            </Header> */}

            {isLoading && <Spinner />}
            {error && <ErrorText>{error.message || error}</ErrorText>}

            {!isLoading && applications.length === 0 && (
                <NoDataFound
                    title="No applications yet"
                    message="You have not applied for any jobs yet. Your applications will appear here."
                />
            )}

            {!isLoading && applications.length > 0 && (
                <Grid>
                    {applications.map((application) => (
                        <Card key={application.id}>
                            <CardTop>
                                <div>
                                    <JobTitle>{application.job_title}</JobTitle>
                                    <Company>{application.company_name}</Company>
                                </div>
                                <StatusBadge status={application.status}>{application.status || 'pending'}</StatusBadge>
                            </CardTop>

                            <Details>
                                <DetailRow>
                                    <Label>Applied For</Label>
                                    <Value>{application.job_applied || application.job_title}</Value>
                                </DetailRow>
                                <DetailRow>
                                    <Label>Applied Date</Label>
                                    <Value>{formatDate(application.applied_date)}</Value>
                                </DetailRow>
                            </Details>
                        </Card>
                    ))}
                </Grid>
            )}
        </Page>
    )
}
