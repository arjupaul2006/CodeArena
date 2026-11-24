import {
  CalendarDays,
  Link as LinkIcon,
  MapPin,
  Mail,
  User,
  VenusAndMars,
} from "lucide-react";

const formatValue = (value) => {
  if (typeof value === "string" && value.trim()) return value;
  return "Not provided";
};

const formatDate = (value) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function DetailItem({ icon: Icon, label, value, href }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#d5e7d7] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] p-4">
      <div className="rounded-lg bg-[#e8f3e8] dark:bg-[#111813] p-2 text-[#3f7d55] dark:text-[#86c79a]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-[#668170] dark:text-[#aabdaf]">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block break-all text-sm font-semibold text-[#3f7d55] dark:text-[#86c79a] hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="mt-1 text-sm font-semibold text-[#244333] dark:text-[#edf4ef]">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function ProfileDetails({ user, profile }) {
  const details = user && typeof user === "object" ? user : profile;
  const gender = details?.gender
    ? details.gender.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "Not provided";

  return (
    <section className="rounded-2xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019]/80 p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-[#183226] dark:text-[#edf4ef]">Personal Details</h2>
        <p className="mt-1 text-sm text-[#668170] dark:text-[#aabdaf]">
          Profile information shared by this user.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <DetailItem
          icon={User}
          label="Username"
          value={formatValue(details?.username)}
        />
        <DetailItem
          icon={User}
          label="Full Name"
          value={formatValue(details?.fullName || details?.name)}
        />
        <DetailItem
          icon={Mail}
          label="Email"
          value={formatValue(details?.email)}
        />
        <DetailItem
          icon={VenusAndMars}
          label="Gender"
          value={gender}
        />
        <DetailItem
          icon={CalendarDays}
          label="Birthday"
          value={formatDate(details?.birthday)}
        />
        <DetailItem
          icon={MapPin}
          label="Location"
          value={formatValue(details?.location)}
        />
        <DetailItem
          icon={LinkIcon}
          label="LinkedIn"
          value={formatValue(details?.linkedin)}
          href={details?.linkedin || undefined}
        />
        <DetailItem
          icon={LinkIcon}
          label="GitHub"
          value={formatValue(details?.github)}
          href={details?.github || undefined}
        />
        <DetailItem
          icon={LinkIcon}
          label="X"
          value={formatValue(details?.xLink)}
          href={details?.xLink || undefined}
        />
      </div>

    </section>
  );
}
