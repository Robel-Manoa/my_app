import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  Admin,
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  Edit,
  EditButton,
  List,
  ReferenceInput,
  Resource,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  TopToolbar,
  useNotify,
  useRecordContext,
  useRefresh,
} from 'react-admin'
import { authProvider } from './authProvider'
import { dataProvider } from './dataProvider'
import { apiFetch } from './api'
import './styles.css'

const departments = [
  <TextInput source="name" key="name" />,
  <TextInput source="code" key="code" />,
  <TextInput source="description" key="description" multiline />,
  <BooleanInput source="active" key="active" />,
]

const DepartmentList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="code" />
      <TextField source="description" />
      <BooleanField source="active" />
      <EditButton />
    </Datagrid>
  </List>
)

const DepartmentCreate = () => <Create><SimpleForm>{departments}</SimpleForm></Create>
const DepartmentEdit = () => <Edit><SimpleForm>{departments}</SimpleForm></Edit>

const EmployeeList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="firstName" />
      <TextField source="lastName" />
      <TextField source="email" />
      <TextField source="jobTitle" />
      <TextField source="departmentId" />
      <TextField source="status" />
      <TextField source="salaryBand" />
      <EditButton />
    </Datagrid>
  </List>
)

const EmployeeForm = () => (
  <SimpleForm>
    <TextInput source="firstName" />
    <TextInput source="lastName" />
    <TextInput source="email" />
    <TextInput source="jobTitle" />
    <ReferenceInput source="departmentId" reference="departments"><SelectInput optionText="name" /></ReferenceInput>
    <SelectInput source="status" choices={[{ id: 'ACTIVE', name: 'Active' }, { id: 'ON_LEAVE', name: 'On leave' }, { id: 'INACTIVE', name: 'Inactive' }]} />
    <TextInput source="salaryBand" />
  </SimpleForm>
)

const EmployeeCreate = () => <Create><EmployeeForm /></Create>
const EmployeeEdit = () => <Edit><EmployeeForm /></Edit>

const LifecycleButton = ({ action }: { action: 'publish' | 'archive' }) => {
  const record = useRecordContext()
  const refresh = useRefresh()
  const notify = useNotify()
  if (!record) return null
  return <button className="ra-action" onClick={async () => {
    await apiFetch(`/announcements/${record.id}/${action}`, { method: 'POST' })
    notify(`Announcement ${action}ed`)
    refresh()
  }}>{action}</button>
}

const AnnouncementList = () => (
  <List actions={<TopToolbar />}>
    <Datagrid>
      <TextField source="title" />
      <TextField source="status" />
      <TextField source="departmentId" />
      <DateField source="publishedAt" />
      <LifecycleButton action="publish" />
      <LifecycleButton action="archive" />
      <EditButton />
    </Datagrid>
  </List>
)

const AnnouncementForm = () => (
  <SimpleForm>
    <TextInput source="title" fullWidth />
    <TextInput source="body" fullWidth multiline />
    <ReferenceInput source="departmentId" reference="departments"><SelectInput optionText="name" emptyText="All company" /></ReferenceInput>
  </SimpleForm>
)
const AnnouncementCreate = () => <Create><AnnouncementForm /></Create>
const AnnouncementEdit = () => <Edit><AnnouncementForm /></Edit>

const FeedbackAction = ({ action }: { action: 'review' | 'close' }) => {
  const record = useRecordContext()
  const refresh = useRefresh()
  if (!record) return null
  return <button className="ra-action" onClick={async () => {
    const key = action === 'review' ? 'reviewNote' : 'closeNote'
    await apiFetch(`/feedback/${record.id}/${action}`, { method: 'POST', body: JSON.stringify({ [key]: `${action} completed by admin` }) })
    refresh()
  }}>{action}</button>
}

const FeedbackList = () => (
  <List>
    <Datagrid>
      <TextField source="subject" />
      <TextField source="message" />
      <TextField source="departmentId" />
      <TextField source="status" />
      <TextField source="reviewNote" />
      <FeedbackAction action="review" />
      <FeedbackAction action="close" />
    </Datagrid>
  </List>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Admin dataProvider={dataProvider} authProvider={authProvider} requireAuth>
      <Resource name="departments" list={DepartmentList} create={DepartmentCreate} edit={DepartmentEdit} />
      <Resource name="employees" list={EmployeeList} create={EmployeeCreate} edit={EmployeeEdit} />
      <Resource name="announcements" list={AnnouncementList} create={AnnouncementCreate} edit={AnnouncementEdit} />
      <Resource name="feedback" list={FeedbackList} />
    </Admin>
  </React.StrictMode>
)
