import styled from 'styled-components';

export const StyledJobList = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 34px 24px 24px;
  color: ${({ theme }) => theme.text};

  @media (max-width: 640px) {
    padding: 24px 16px 12px;
  }
`;

export const HeroPanel = styled.section`
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 28px;
  align-items: center;
  min-height: 330px;
  padding: 34px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background:
    linear-gradient(135deg, ${({ theme }) => theme.surface} 0%, ${({ theme }) => theme.backgroundSoft} 100%);
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 640px) {
    padding: 24px 18px;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
`;

export const Eyebrow = styled.span`
  width: fit-content;
  padding: 7px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.accent};
  font-size: 13px;
  font-weight: 500;
`;

export const HeaderTitle = styled.h1`
  max-width: 720px;
  margin: 0;
  font-size: clamp(32px, 5vw, 58px);
  line-height: 1.02;
  font-weight: 500;
  letter-spacing: 0;
  color: ${({ theme }) => theme.text};
`;

export const HeaderSubtitle = styled.p`
  max-width: 650px;
  margin: 0;
  color: ${({ theme }) => theme.mutedText};
  font-size: 17px;
`;

export const HeroSearch = styled.div`
  max-width: 690px;
`;

export const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 4px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const StatChip = styled.div`
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};

  strong {
    display: block;
    font-size: 22px;
    color: ${({ theme }) => theme.text};
  }

  span {
    color: ${({ theme }) => theme.mutedText};
    font-size: 13px;
    font-weight: 500;
  }
`;

export const HeroVisual = styled.div`
  min-height: 250px;
  display: grid;
  align-content: center;
  gap: 14px;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const FloatingCard = styled.div`
  width: ${({ $wide }) => ($wide ? '100%' : '86%')};
  margin-left: ${({ $offset }) => ($offset ? 'auto' : '0')};
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  transform: rotate(${({ $tilt }) => $tilt || '0deg'});
  transition: transform .22s ease, box-shadow .22s ease;

  &:hover {
    transform: translateY(-4px) rotate(${({ $tilt }) => $tilt || '0deg'});
    box-shadow: ${({ theme }) => theme.shadowStrong};
  }
`;

export const FloatingTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;

  strong {
    font-size: 15px;
  }
`;

export const PulseDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.success};
  box-shadow: 0 0 0 8px rgba(18, 158, 99, 0.12);
`;

export const MiniMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: ${({ theme }) => theme.mutedText};
  font-size: 13px;
  font-weight: 500;

  span {
    padding: 6px 9px;
    border-radius: 999px;
    background: ${({ theme }) => theme.surfaceAlt};
  }
`;

export const FilterShell = styled.section`
  margin: 22px 0;
`;

export const FilterTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;

  h2 {
    margin: 0;
    font-size: 20px;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.mutedText};
    font-weight: 500;
  }

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const JobCount = styled.span`
  display: block;
  margin-top: 4px;
  color: ${({ theme }) => theme.mutedText};
  font-size: 14px;
  font-weight: 550;
`;

export const SearchSortFilterDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(145px, 1fr)) auto;
  align-items: end;
  gap: 14px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};

  input, select {
    width: 100%;
    height: 44px;
    padding: 0 12px;
    background-color: ${({ theme }) => theme.inputBg};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    font-size: 14px;
    color: ${({ theme }) => theme.text};
    outline: none;
    transition: border-color .18s ease, box-shadow .18s ease;

    &:focus {
      border-color: ${({ theme }) => theme.primary};
      box-shadow: 0 0 0 4px rgba(15, 139, 141, 0.14);
    }
  }

  @media (max-width: 1120px) {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  label {
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.mutedText};
    text-transform: uppercase;
  }
`;

export const FilterActionRow = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 700px) {
    justify-content: stretch;
  }
`;

export const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 34px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const JobCard = styled.article`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  padding: 22px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 12px 30px rgba(20, 33, 61, 0.06);
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;

  &:before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: ${({ theme }) => theme.primary};
    opacity: .9;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow: ${({ theme }) => theme.shadowStrong};
  }
`;

export const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 18px;
`;

export const JobTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  color: ${({ theme }) => theme.text};
  font-weight: 650;
  cursor: pointer;
  transition: color .18s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

export const CompanyName = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.mutedText};
  font-weight: 550;
  font-size: 14px;
  margin: 8px 0 0;
`;

export const Badge = styled.span`
  flex: 0 0 auto;
  background: rgba(18, 158, 99, 0.12);
  color: ${({ theme }) => theme.success};
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 650;
  text-transform: uppercase;

  &.closed {
    background: ${({ theme }) => theme.surfaceAlt};
    color: ${({ theme }) => theme.mutedText};
  }
`;

export const JobMeta = styled.div`
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  color: ${({ theme }) => theme.mutedText};
  font-size: 13px;
  font-weight: 550;

  span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    max-width: 100%;
    min-height: 34px;
    background: ${({ theme }) => theme.surfaceAlt};
    padding: 7px 10px;
    border-radius: 8px;
  }

  svg {
    color: ${({ theme }) => theme.primary};
    flex: 0 0 auto;
  }
`;

export const Description = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0 0 18px;
  color: ${({ theme }) => theme.mutedText};
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

export const Button = styled.button`
  min-height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  outline: none;
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease, color .18s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px rgba(15, 139, 141, 0.18);
  }
`;

export const ViewDetailsBtn = styled(Button)`
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  flex: 1;

  &:hover {
    background: ${({ theme }) => theme.surfaceAlt};
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const ApplyNowBtn = styled(Button)`
  background: ${({ theme }) => theme.primary};
  color: #ffffff;
  border: 1px solid ${({ theme }) => theme.primary};
  flex: 1.2;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    box-shadow: 0 12px 24px rgba(15, 139, 141, 0.22);
  }

  &:disabled {
    cursor: not-allowed;
    transform: none;
    background: ${({ theme }) => theme.surfaceAlt};
    border-color: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.mutedText};
    box-shadow: none;
  }
`;

export const FilterButton = styled(Button)`
  background: ${({ theme }) => theme.primary};
  color: #ffffff;
  border: 1px solid ${({ theme }) => theme.primary};
  min-width: 138px;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }

  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const ResetButton = styled(Button)`
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.mutedText};
  border: 1px solid ${({ theme }) => theme.border};
  min-width: 100px;

  &:hover {
    background: ${({ theme }) => theme.surfaceAlt};
    color: ${({ theme }) => theme.text};
  }
`;
