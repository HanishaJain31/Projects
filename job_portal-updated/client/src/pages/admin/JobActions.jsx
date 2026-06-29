import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiBriefcase, FiEdit3, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi'
import { fetchAllJobs } from '../../features/admin/adminJobSlice'
import Spinner from '../../ui/Spinner'
import Pagination from '../../components/Pagination'
import Search from '../../components/Search'
import Select from '../../components/Select'
import NoDataFound from '../../components/NoDataFound'
import useDebounce from '../../hooks/useDebounce'
import EditJobAction from './EditJobAction'
import ViewJobAction from './ViewJobAction'
import DeleteJobAction from './DeleteJobAction'
import CreateJobAction from './CreateJobAction'
import {
    ActionGroup,
    AdminButton,
    AdminHero,
    AdminPage,
    AdminTable,
    EmptyState,
    HeroActions,
    HeroText,
    StatusBadge,
    TableCell,
    TableHeader,
    TablePanel,
    TableScroll,
    Toolbar,
} from './AdminStyles'

const ITEMS_PER_PAGE = 10

function isNoDataError(error) {
    const keyword = error?.message?.keyword || error?.keyword
    return typeof keyword === 'string' && keyword.startsWith('no_')
}

export default function JobActions() {
    const dispatch = useDispatch()
    const { jobs, isLoading, error } = useSelector((state) => state.adminJob)
    const total = useSelector((state) => state.adminJob.total)
    const jobList = jobs || []
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm)
    const [status, setStatus] = useState('')
    const [sortOption, setSortOption] = useState('')
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [selectedJob, setSelectedJob] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    const fetchJobs = useCallback(() => {
        dispatch(fetchAllJobs({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: debouncedSearchTerm || undefined,
            sort: sortOption || undefined,
            status: status || undefined,
        }))
    }, [dispatch, currentPage, debouncedSearchTerm, sortOption, status])

    useEffect(() => {
        fetchJobs()
    }, [fetchJobs])

    function handlePageChange(page) {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <AdminPage>
            <AdminHero>
                <HeroText>
                    <span><FiBriefcase /> Jobs</span>
                    <h1>Manage job postings</h1>
                    <p>Create new roles, update posting details, and track active or closed jobs.</p>
                </HeroText>
                <HeroActions>
                    <AdminButton type="button" onClick={() => setIsCreateOpen(true)}><FiPlus /> Create Job</AdminButton>
                </HeroActions>
            </AdminHero>

            <Toolbar>
                <Search value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Select onChange={(e) => setStatus(e.target.value)} value={status} label="Status" options={[
                    { value: 'active', label: 'Active' },
                    { value: 'closed', label: 'Closed' },
                ]} />
                <Select onChange={(e) => setSortOption(e.target.value)} value={sortOption} label="Sort by" options={[
                    { value: '', label: 'Default Sort' },
                    { value: 'ASC', label: 'Salary Ascending' },
                    { value: 'DESC', label: 'Salary Descending' },
                ]} />
            </Toolbar>

            {isLoading ? (
                <Spinner />
            ) : error && !isNoDataError(error) ? (
                <EmptyState>{error.message?.keyword || error.message || 'Failed to fetch jobs'}</EmptyState>
            ) : jobList.length === 0 ? (
                <NoDataFound title="No jobs found" message="Create a new job or adjust your filters to see matching jobs." />
            ) : (
                <TablePanel>
                    <TableScroll>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <TableHeader>Job Name</TableHeader>
                                    <TableHeader>Company</TableHeader>
                                    <TableHeader>Location</TableHeader>
                                    <TableHeader>Salary</TableHeader>
                                    <TableHeader>Status</TableHeader>
                                    <TableHeader>Actions</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {jobList.map((job) => (
                                    <tr key={job.job_id || job.id}>
                                        <TableCell>{job.job_name}</TableCell>
                                        <TableCell>{job.company_name}</TableCell>
                                        <TableCell>{job.location}</TableCell>
                                        <TableCell>{job.job_salary}</TableCell>
                                        <TableCell><StatusBadge $status={job.status}>{job.status}</StatusBadge></TableCell>
                                        <TableCell>
                                            <ActionGroup>
                                                <AdminButton $variant="ghost" onClick={() => { setSelectedJob(job); setIsViewOpen(true) }}><FiEye /> View</AdminButton>
                                                <AdminButton $variant="ghost" onClick={() => { setSelectedJob(job); setIsEditOpen(true) }}><FiEdit3 /> Edit</AdminButton>
                                                <AdminButton $variant="ghost" onClick={() => { setSelectedJob(job); setIsDeleteOpen(true) }}><FiTrash2 /> Delete</AdminButton>
                                            </ActionGroup>
                                        </TableCell>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                    </TableScroll>
                </TablePanel>
            )}

            {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages} total={ITEMS_PER_PAGE} onPageChange={handlePageChange} label="Total" align="center" size="md" />}

            <EditJobAction isOpen={isEditOpen} job={selectedJob} onClose={() => { setIsEditOpen(false); setSelectedJob(null) }} />
            <ViewJobAction isOpen={isViewOpen} job={selectedJob} onClose={() => { setIsViewOpen(false); setSelectedJob(null) }} />
            <DeleteJobAction isOpen={isDeleteOpen} job={selectedJob} onClose={() => { setIsDeleteOpen(false); setSelectedJob(null) }} />
            <CreateJobAction isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreated={fetchJobs} />
        </AdminPage>
    )
}
