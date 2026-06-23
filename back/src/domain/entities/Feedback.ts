import { DomainError } from '../exceptions/DomainError'
import { FeedbackStatus } from '../model/types'

export interface FeedbackProps {
  id: string
  employeeId: string
  departmentId: string
  subject: string
  message: string
  status: FeedbackStatus
  reviewerId?: string
  reviewNote?: string
  closeNote?: string
  createdAt: string
  updatedAt: string
}

export class Feedback {
  private constructor(private readonly props: FeedbackProps) {}

  static submit(input: Omit<FeedbackProps, 'status' | 'createdAt' | 'updatedAt' | 'reviewerId' | 'reviewNote' | 'closeNote'>) {
    Feedback.assertContent(input.subject, input.message)
    const now = new Date().toISOString()
    return new Feedback({ ...input, status: 'SUBMITTED', createdAt: now, updatedAt: now })
  }

  static rehydrate(props: FeedbackProps) {
    return new Feedback(props)
  }

  review(reviewerId: string, reviewNote: string) {
    if (this.props.status !== 'SUBMITTED') {
      throw new DomainError('Only submitted feedback can be reviewed', 'INVALID_FEEDBACK_TRANSITION')
    }
    if (reviewNote.trim().length < 5) {
      throw new DomainError('Review note must contain at least 5 characters', 'INVALID_REVIEW_NOTE')
    }
    return new Feedback({ ...this.props, status: 'REVIEWED', reviewerId, reviewNote, updatedAt: new Date().toISOString() })
  }

  close(closeNote: string) {
    if (this.props.status === 'CLOSED') {
      throw new DomainError('Feedback is already closed', 'INVALID_FEEDBACK_TRANSITION')
    }
    if (closeNote.trim().length < 5) {
      throw new DomainError('Close note must contain at least 5 characters', 'INVALID_CLOSE_NOTE')
    }
    return new Feedback({ ...this.props, status: 'CLOSED', closeNote, updatedAt: new Date().toISOString() })
  }

  toJSON(): FeedbackProps {
    return { ...this.props }
  }

  private static assertContent(subject: string, message: string) {
    if (subject.trim().length < 4) {
      throw new DomainError('Feedback subject must contain at least 4 characters', 'INVALID_FEEDBACK_SUBJECT')
    }
    if (message.trim().length < 10) {
      throw new DomainError('Feedback message must contain at least 10 characters', 'INVALID_FEEDBACK_MESSAGE')
    }
  }
}
