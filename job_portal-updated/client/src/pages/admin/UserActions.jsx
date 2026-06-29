import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { FiEye, FiPower, FiUsers } from 'react-icons/fi'
import Pagination from '../../components/Pagination'
import Search from '../../components/Search'
import Select from '../../components/Select'
import NoDataFound from '../../components/NoDataFound'
import { fetchAllUsers, updateUserStatusById } from '../../features/admin/adminUserSlice'
import getToastMessage from '../../utils/getToastMessage'
import useDebounce from '../../hooks/useDebounce'
import Spinner from '../../ui/Spinner'
import ViewUserAction from './ViewUserAction'
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
    if (!error) return 'Failed to fetch users'
    if (typeof error === 'string') return error
    if (typeof error.message === 'string') return error.message
    return error.message?.keyword || error.message?.message || 'Failed to fetch users'
}

function isNoDataError(error) {
    const keyword = error?.message?.keyword || error?.keyword
    return typeof keyword === 'string' && keyword.startsWith('no_')
}

export default function UserActions() {
    const dispatch = useDispatch()
    const { users, isLoading, error, total } = useSelector((state) => state.adminUser)
    const userList = users || []
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm)
    const [status, setStatus] = useState('active')
    const [currentPage, setCurrentPage] = useState(1)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    const fetchUsers = useCallback(() => {
        dispatch(fetchAllUsers({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: debouncedSearchTerm || undefined,
            status: status || undefined,
        }))
    }, [currentPage, debouncedSearchTerm, dispatch, status])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    function handleSearchChange(event) {
        setSearchTerm(event.target.value)
        setCurrentPage(1)
    }

    function handleStatusChange(event) {
        setStatus(event.target.value)
        setCurrentPage(1)
    }

    async function handleStatusToggle(userId) {
        const action = await dispatch(updateUserStatusById(userId))

        if (updateUserStatusById.fulfilled.match(action) && action.payload?.code === '1') {
            toast.success('User status updated successfully')
            fetchUsers()
        } else {
            toast.error(getToastMessage(action.payload, 'Could not update user status'))
        }
    }

    return (
        <AdminPage>
            <AdminHero>
                <HeroText>
                    <span><FiUsers /> Users</span>
                    <h1>Manage users</h1>
                    <p>Search user accounts, review profile details, and control account status.</p>
                </HeroText>
            </AdminHero>

            <Toolbar $columns="minmax(280px, 1fr) 190px">
                <Search value={searchTerm} onChange={handleSearchChange} />
                <Select value={status} onChange={handleStatusChange} label="Status" options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                ]} />
            </Toolbar>

            {isLoading ? (
                <Spinner />
            ) : error && !isNoDataError(error) ? (
                <EmptyState>{getErrorMessage(error)}</EmptyState>
            ) : userList.length === 0 ? (
                <NoDataFound title="No users found" message="Try changing the search term or status filter." />
            ) : (
                <TablePanel>
                    <TableScroll>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <TableHeader>Name</TableHeader>
                                    <TableHeader>Email</TableHeader>
                                    <TableHeader>Job Role</TableHeader>
                                    <TableHeader>Status</TableHeader>
                                    <TableHeader>Actions</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {userList.map((user) => {
                                    const statusLabel = user.is_active ? 'active' : 'inactive'
                                    return (
                                        <tr key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.job_role || 'N/A'}</TableCell>
                                            <TableCell><StatusBadge $status={statusLabel}>{statusLabel}</StatusBadge></TableCell>
                                            <TableCell>
                                                <ActionGroup>
                                                    <AdminButton $variant="ghost" onClick={() => { setSelectedUser(user); setIsViewOpen(true) }}><FiEye /> View</AdminButton>
                                                    <AdminButton onClick={() => handleStatusToggle(user.id)}><FiPower /> {user.is_active ? 'Deactivate' : 'Activate'}</AdminButton>
                                                </ActionGroup>
                                            </TableCell>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </AdminTable>
                    </TableScroll>
                </TablePanel>
            )}

            {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages} total={ITEMS_PER_PAGE} onPageChange={setCurrentPage} label="Total" align="center" size="md" />}
            <ViewUserAction isOpen={isViewOpen} user={selectedUser} onClose={() => { setIsViewOpen(false); setSelectedUser(null) }} />
        </AdminPage>
    )
}
