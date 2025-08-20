export type Course = {
	courseID: string;
	teacher: string;
};

export type WebsiteLink = {
	courseID: string;
	title: string;
	url: string;
	description?: string;
	teacher?: string;
};

export type GameLink = {
	courseID: string;
	title: string;
	downloadUrl?: string;
	onlineUrl?: string; 
	description?: string;
	teacher?: string;
}