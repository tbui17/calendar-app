import { Component, ErrorInfo, ReactNode } from "react";

import { AxiosError } from "axios";
import ErrorAccessTokenExpired from "./errors/error-access-token-expired";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | AxiosError | null;
	errorInfo: ErrorInfo | null;
}

class CalendarErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error: Error | AxiosError) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState({ hasError: true, error, errorInfo });
	}

	render() {
		if (this.state.hasError) {
			if (this.state.error instanceof AxiosError && this.state.error.response?.status === 401) {
				return (
					<div className="vh-center">
						<ErrorAccessTokenExpired />
					</div>
				);
			}
			return (
				<div>
					<h1>Something went wrong.</h1>
					<p>{this.state.error?.message}</p>
					<p>{this.state.errorInfo?.componentStack}</p>
				</div>
			);
		}

		return this.props.children;
	}
}

export default CalendarErrorBoundary;
