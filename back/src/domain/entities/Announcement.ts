import { DomainError } from '../exceptions/DomainError'
import { AnnouncementStatus } from '../model/types'

export interface AnnouncementProps {
  id: string
  title: string
  body: string
  status: AnnouncementStatus
  authorId: string
  departmentId?: string
  publishedAt?: string
  archivedAt?: string
  createdAt: string
  updatedAt: string
}

export class Announcement {
  private constructor(private readonly props: AnnouncementProps) {}

  static create(input: Omit<AnnouncementProps, 'status' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'archivedAt'>) {
    Announcement.assertContent(input.title, input.body)
    const now = new Date().toISOString()
    return new Announcement({ ...input, status: 'DRAFT', createdAt: now, updatedAt: now })
  }

  static rehydrate(props: AnnouncementProps) {
    return new Announcement(props)
  }

  updateDraft(input: Partial<Pick<AnnouncementProps, 'title' | 'body' | 'departmentId'>>) {
    if (this.props.status !== 'DRAFT') {
      throw new DomainError('Only draft announcements can be edited', 'ANNOUNCEMENT_NOT_EDITABLE')
    }
    const next = { ...this.props, ...input, updatedAt: new Date().toISOString() }
    Announcement.assertContent(next.title, next.body)
    return new Announcement(next)
  }

  publish() {
    if (this.props.status !== 'DRAFT') {
      throw new DomainError('Only draft announcements can be published', 'INVALID_ANNOUNCEMENT_TRANSITION')
    }
    const now = new Date().toISOString()
    return new Announcement({ ...this.props, status: 'PUBLISHED', publishedAt: now, updatedAt: now })
  }

  archive() {
    if (this.props.status !== 'PUBLISHED') {
      throw new DomainError('Only published announcements can be archived', 'INVALID_ANNOUNCEMENT_TRANSITION')
    }
    const now = new Date().toISOString()
    return new Announcement({ ...this.props, status: 'ARCHIVED', archivedAt: now, updatedAt: now })
  }

  toJSON(): AnnouncementProps {
    return { ...this.props }
  }

  private static assertContent(title: string, body: string) {
    if (title.trim().length < 4) {
      throw new DomainError('Announcement title must contain at least 4 characters', 'INVALID_ANNOUNCEMENT_TITLE')
    }
    if (body.trim().length < 10) {
      throw new DomainError('Announcement body must contain at least 10 characters', 'INVALID_ANNOUNCEMENT_BODY')
    }
  }
}
