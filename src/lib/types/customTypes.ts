export type Course = {
	courseID: string;
	teacher: string;
};

export type WebsiteLink = {
	id: string;
	courseID: string;
	title: string;
	url: string;
	description?: string;
	teacher?: string;
	thumbnailUrl?: string;
};

export type GameLink = {
	id: string;
	courseID: string;
	title: string;
	downloadUrl?: string;
	onlineUrl?: string; 
	description?: string;
	teacher?: string;
	thumbnailUrl?: string;
}
