import { cn } from "../../utils/cn";

interface ProfileAvatarProps {
  imageUrl: string | null;
  className?: string;
}

export function ProfileAvatar({ imageUrl, className }: ProfileAvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-border",
        className,
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="프로필 이미지" className="size-full object-cover" />
      ) : (
        <img src="/icons/person.svg" alt="" className="size-1/2" />
      )}
    </div>
  );
}
