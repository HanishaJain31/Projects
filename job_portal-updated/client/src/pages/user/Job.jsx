import styled from 'styled-components'

const JobCard = styled.div`
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
`

export default function Job({ job }) {
  return (
    <JobCard>
      <li>{job.title}</li>
      <p>{job.description}</p>
    </JobCard>
  )
}
