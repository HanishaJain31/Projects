import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    FiArrowRight,
    FiBriefcase,
    FiDollarSign,
    FiFilter,
    FiMapPin,
    FiTarget,
    FiTool,
    FiTrendingUp,
} from 'react-icons/fi'
import Spinner from '../../ui/Spinner'
import { viewJobs } from '../../features/user/jobSlice'
import Search from '../../components/Search'
import Select from '../../components/Select'
import Pagination from '../../components/Pagination'
import NoDataFound from '../../components/NoDataFound'
import useDebounce from '../../hooks/useDebounce'
import {
    ActionGroup,
    ApplyNowBtn,
    Badge,
    CompanyName,
    Description,
    Eyebrow,
    FilterActionRow,
    FilterButton,
    FilterShell,
    FilterTop,
    FloatingCard,
    FloatingTop,
    HeaderSubtitle,
    HeaderTitle,
    HeroContent,
    HeroPanel,
    HeroSearch,
    HeroStats,
    HeroVisual,
    InputGroup,
    JobCard,
    JobCount,
    JobGrid,
    JobHeader,
    JobMeta,
    JobTitle,
    MiniMeta,
    PulseDot,
    SearchSortFilterDiv,
    StatChip,
    StyledJobList,
    ViewDetailsBtn,
} from './JobListcss'

export default function JobList() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { jobs, isLoading } = useSelector((state) => state.jobs)
    const total = useSelector((state) => state.jobs.total)

    const jobList = jobs || []
    const [searchTerm, setSearchTerm] = useState('')
    const [sortOption, setSortOption] = useState('')
    const [jobType, setJobType] = useState('')
    const [minSalary, setMinSalary] = useState('')
    const [maxSalary, setMaxSalary] = useState('')
    const [status, setStatus] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm)
    const [filters, setFilters] = useState({
        sort: '',
        job_type: '',
        min_salary: '',
        max_salary: '',
        status: '',
    })
    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 6
    const totalPages = Math.ceil(total / itemsPerPage)

    const fetchJobs = useCallback(() => {
        dispatch(viewJobs({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearchTerm || undefined,
            sort: filters.sort || undefined,
            job_type: filters.job_type || undefined,
            min_salary: filters.min_salary || undefined,
            max_salary: filters.max_salary || undefined,
            status: filters.status || undefined,
        }))
    }, [currentPage, debouncedSearchTerm, dispatch, filters])

    useEffect(() => {
        fetchJobs()
    }, [fetchJobs])

    function handlePageChange(page) {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function handleApplyFilters() {
        setCurrentPage(1)
        setFilters({
            sort: sortOption,
            job_type: jobType,
            min_salary: minSalary,
            max_salary: maxSalary,
            status,
        })
    }

    function handleViewDetails(id) {
        navigate(`/job/${id}`)
    }

    function isClosedJob(job) {
        return String(job?.status || '').trim().toLowerCase() === 'closed'
    }

    function handleApplyNow(job) {
        if (isClosedJob(job)) return

        const token = localStorage.getItem('token')
        if (token) {
            navigate(`/apply-job/${job.id}`)
            return
        }

        localStorage.setItem('savedId', job.id)
        navigate('/signup')
    }

    function handleSearchChange(event) {
        setSearchTerm(event.target.value)
        setCurrentPage(1)
    }

    function formatSkillList(skills) {
        if (!skills) return 'N/A'
        return skills.split(',').map((skill) => skill.trim()).join(', ')
    }

    function formatJobType(type) {
        if (!type) return 'Full Time'
        return type.replace('_', ' ')
    }

    function getDescription(job) {
        const description = String(job.description ?? job.job_description ?? '').trim()
        if (!description || description.toLowerCase() === 'undefined' || description.toLowerCase() === 'null') {
            return 'No job description has been added for this role yet.'
        }

        return description
    }

    return (
        <StyledJobList>
            <HeroPanel>
                <HeroContent>
                    <Eyebrow>Curated openings, faster applications</Eyebrow>
                    <HeaderTitle>Find work that fits your next chapter.</HeaderTitle>
                    <HeaderSubtitle>
                        Search active roles, compare salary ranges, and apply from one focused workspace.
                    </HeaderSubtitle>
                    <HeroSearch>
                        <Search value={searchTerm} onChange={handleSearchChange} />
                    </HeroSearch>
                    <HeroStats>
                        <StatChip>
                            <strong>{total || jobList.length}</strong>
                            <span>Open roles</span>
                        </StatChip>
                        <StatChip>
                            <strong>5</strong>
                            <span>Smart filters</span>
                        </StatChip>
                        <StatChip>
                            <strong>1-click</strong>
                            <span>Apply flow</span>
                        </StatChip>
                    </HeroStats>
                </HeroContent>

                <HeroVisual aria-hidden="true">
                    <FloatingCard $wide $tilt="-1.4deg">
                        <FloatingTop>
                            <strong>Product Designer</strong>
                            <PulseDot />
                        </FloatingTop>
                        <MiniMeta>
                            <span>Remote</span>
                            <span>Full time</span>
                            <span>Design Systems</span>
                        </MiniMeta>
                    </FloatingCard>
                    <FloatingCard $offset $tilt="1.8deg">
                        <FloatingTop>
                            <strong>Frontend Engineer</strong>
                            <PulseDot />
                        </FloatingTop>
                        <MiniMeta>
                            <span>React</span>
                            <span>Hybrid</span>
                        </MiniMeta>
                    </FloatingCard>
                    <FloatingCard $wide $tilt="-0.8deg">
                        <FloatingTop>
                            <strong>Data Analyst</strong>
                            <PulseDot />
                        </FloatingTop>
                        <MiniMeta>
                            <span>SQL</span>
                            <span>Growth</span>
                            <span>Active</span>
                        </MiniMeta>
                    </FloatingCard>
                </HeroVisual>
            </HeroPanel>

            <FilterShell>
                <FilterTop>
                    <div>
                        <h2>Explore opportunities</h2>
                        <JobCount>{total || jobList.length} matching roles</JobCount>
                    </div>
                    <p>Refine by pay, role type, and posting status.</p>
                </FilterTop>

                <SearchSortFilterDiv>
                    <InputGroup>
                        <label>Sort Metrics</label>
                        <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} label="Sort By" options={[
                            { value: 'salary_asc', label: 'Salary: Low to High' },
                            { value: 'salary_desc', label: 'Salary: High to Low' },
                            { value: 'name_asc', label: 'Name: A to Z' },
                            { value: 'name_desc', label: 'Name: Z to A' },
                        ]} />
                    </InputGroup>

                    <InputGroup>
                        <label>Work Arrangement</label>
                        <Select value={jobType} onChange={(e) => setJobType(e.target.value)} label="Job Type" options={[
                            { value: 'full_time', label: 'Full Time' },
                            { value: 'part_time', label: 'Part Time' },
                            { value: 'contract', label: 'Contract' },
                            { value: 'internship', label: 'Internship' },
                            { value: 'remote', label: 'Remote' },
                        ]} />
                    </InputGroup>

                    <InputGroup>
                        <label>Minimum Salary</label>
                        <input type="number" placeholder="e.g. 50000" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} />
                    </InputGroup>

                    <InputGroup>
                        <label>Maximum Salary</label>
                        <input type="number" placeholder="e.g. 120000" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} />
                    </InputGroup>

                    <InputGroup>
                        <label>Posting Status</label>
                        <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status" options={[
                            { value: 'active', label: 'Active Only' },
                            { value: 'closed', label: 'Closed' },
                        ]} />
                    </InputGroup>

                    <FilterActionRow>
                        <FilterButton type="button" onClick={handleApplyFilters}><FiFilter /> Apply</FilterButton>
                    </FilterActionRow>
                </SearchSortFilterDiv>
            </FilterShell>

            {isLoading && <Spinner />}

            {!isLoading && jobList.length > 0 ? (
                <JobGrid>
                    {jobList.map((job) => (
                        <JobCard key={job.id}>
                            <JobHeader>
                                <div>
                                    <JobTitle onClick={() => handleViewDetails(job.id)}>{job.job_name}</JobTitle>
                                    <CompanyName><FiBriefcase /> {job.company_name}</CompanyName>
                                </div>
                                <Badge className={job.status}>{job.status || 'Active'}</Badge>
                            </JobHeader>

                            <JobMeta>
                                <span><FiMapPin /> {job.location || 'Remote'}</span>
                                <span><FiDollarSign /> {job.job_salary ? `${job.job_salary}` : 'Undisclosed'}</span>
                                <span><FiTrendingUp /> {job.experience_required || 'Entry Level'} years</span>
                                <span><FiBriefcase /> {formatJobType(job.job_type)}</span>
                                <span><FiTool /> {formatSkillList(job.skills)}</span>
                            </JobMeta>

                            <Description>{getDescription(job)}</Description>

                            <ActionGroup>
                                <ViewDetailsBtn type="button" onClick={() => handleViewDetails(job.id)}><FiTarget /> Details</ViewDetailsBtn>
                                <ApplyNowBtn
                                    type="button"
                                    onClick={() => handleApplyNow(job)}
                                    disabled={isClosedJob(job)}
                                    title={isClosedJob(job) ? 'Applications are closed for this job' : 'Apply for this job'}
                                >
                                    {isClosedJob(job) ? 'Closed' : 'Apply Now'} {!isClosedJob(job) && <FiArrowRight />}
                                </ApplyNowBtn>
                            </ActionGroup>
                        </JobCard>
                    ))}
                </JobGrid>
            ) : (
                !isLoading && (
                    <NoDataFound
                        title="No jobs match your criteria"
                        message="Try changing your search, filters, or salary range."
                    />
                )
            )}

            {totalPages > 1 && (
                <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    total={itemsPerPage}
                    onPageChange={handlePageChange}
                    label="Total"
                    align="center"
                    size="md"
                />
            )}
        </StyledJobList>
    )
}
