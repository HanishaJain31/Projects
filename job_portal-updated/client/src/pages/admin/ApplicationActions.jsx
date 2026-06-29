import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { FiCheckCircle, FiEye, FiInbox, FiXCircle } from 'react-icons/fi'
import Pagination from '../../components/Pagination'
import Select from '../../components/Select'
import NoDataFound from '../../components/NoDataFound'
import { fetchAllApplications, updateApplicationStatusById } from '../../features/admin/adminApplicationSlice'
import getToastMessage from '../../utils/getToastMessage'
import Spinner from '../../ui/Spinner'
import ViewApplicationAction from './ViewApplicationAction'
import {
    ActionGroup,
    AdminButton,
    AdminHero,
    AdminPage,
    AdminTable,
    EmptyState,
    HeroText,
    StatusBadge,
    TableCell,
    TableHeader,
    TablePanel,
    TableScroll,
    Toolbar,
} from './AdminStyles'

const ITEMS_PER_PAGE = 10

function getErrorMessage(error) {
    if (!error) return 'Failed to fetch applications'
    if (typeof error === 'string') return error
    if (typeof error.message === 'string') return error.message
    return error.message?.keyword || error.message?.message || 'Failed to fetch applications'
}

function isNoDataError(error) {
    const keyword = error?.message?.keyword || error?.keyword
    return typeof keyword === 'string' && keyword.startsWith('no_')
}

export default function ApplicationActions() {
    const dispatch = useDispatch()
    const { applications, isLoading, error, total } = useSelector((state) => state.adminApplication)
    const applicationList = applications || []
    const [status, setStatus] = useState('pending')
    const [currentPage, setCurrentPage] = useState(1)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [selectedApplication, setSelectedApplication] = useState(null)
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    const fetchApplications = useCallback(() => {
        dispatch(fetchAllApplications({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            status: status || undefined,
        }))
    }, [currentPage, dispatch, status])

    useEffect(() => {
        fetchApplications()
    }, [fetchApplications])

    function handleStatusChange(event) {
        setStatus(event.target.value)
        setCurrentPage(1)
    }

    function handlePageChange(page) {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleApplicationStatus(applicationId, nextStatus) {
        const action = await dispatch(updateApplicationStatusById({ application_id: applicationId, status: nextStatus }))

        if (updateApplicationStatusById.fulfilled.match(action) && action.payload?.code === '1') {
            toast.success(`Application ${nextStatus} successfully`)
            fetchApplications()
        } else {
            toast.error(getToastMessage(action.payload, 'Could not update application status'))
        }
    }

    return (
        <AdminPage>
            <AdminHero>
                <HeroText>
                    <span><FiInbox /> Applications</span>
                    <h1>Review applications</h1>
                    <p>Inspect candidate submissions and move each application through approval decisions.</p>
                </HeroText>
            </AdminHero>

            <Toolbar $columns="220px">
                <Select value={status} onChange={handleStatusChange} label="Status" options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' },
                    { value: 'all', label: 'All' },
                ]} />
            </Toolbar>

            {isLoading ? (
                <Spinner />
            ) : error && !isNoDataError(error) ? (
                <EmptyState>{getErrorMessage(error)}</EmptyState>
            ) : applicationList.length === 0 ? (
                <NoDataFound title="No applications found" message="Try changing the status filter to review other applications." />
            ) : (
                <TablePanel>
                    <TableScroll>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <TableHeader>Candidate</TableHeader>
                                    <TableHeader>Phone</TableHeader>
                                    <TableHeader>Job</TableHeader>
                                    <TableHeader>User</TableHeader>
                                    <TableHeader>Status</TableHeader>
                                    <TableHeader>Actions</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {applicationList.map((application) => (
                                    <tr key={application.id}>
                                        <TableCell>{application.candidate_name}</TableCell>
                                        <TableCell>{application.phone_number}</TableCell>
                                        <TableCell>{application.job_name || application.job_applied}</TableCell>
                                        <TableCell>{application.user_name}</TableCell>
                                        <TableCell><StatusBadge $status={application.status}>{application.status}</StatusBadge></TableCell>
                                        <TableCell>
                                            <ActionGroup>
                                                <AdminButton $variant="ghost" onClick={() => { setSelectedApplication(application); setIsViewOpen(true) }}><FiEye /> View</AdminButton>
                                                <AdminButton disabled={application.status === 'approved'} onClick={() => handleApplicationStatus(application.id, 'approved')}><FiCheckCircle /> Approve</AdminButton>
                                                <AdminButton $variant="ghost" disabled={application.status === 'rejected'} onClick={() => handleApplicationStatus(application.id, 'rejected')}><FiXCircle /> Reject</AdminButton>
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
            <ViewApplicationAction isOpen={isViewOpen} application={selectedApplication} onClose={() => { setIsViewOpen(false); setSelectedApplication(null) }} />
        </AdminPage>
    )
}
