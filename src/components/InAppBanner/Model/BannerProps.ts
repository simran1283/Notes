export interface BannerProps {
  title: string;
  body: string;
  onPress: () => void;        // When user taps the banner
  onClose?: () => void;       // When user taps the overlay
}